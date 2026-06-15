import type { UserPrivate, UserPublic } from "@/models/user.model";

import { NotFoundException, UnauthorizedException } from "@/exceptions/http-exceptions";
import { userRepository } from "@/models/user.repo";
import { verificationService } from "@/services/verification.service";
import { jwtGenerateAccessToken, jwtGenerateRefreshToken, jwtVerifyToken } from "@/utils";

export class AuthService {
  async validateUser(email: string, isLoginRequest?: boolean): Promise<UserPrivate> {
    const user = await userRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new NotFoundException(isLoginRequest ? "invalid_credentials" : "User not found");
    }

    return user;
  }

  async validatePassword(email: string, password: string, isLoginRequest?: boolean): Promise<void> {
    const user = await this.validateUser(email, isLoginRequest);

    if (!password) {
      throw new NotFoundException("password_required");
    }

    const isPasswordValid = await userRepository.validatePasswordWithEmail(email, password);

    if (!isPasswordValid) {
      throw new NotFoundException("invalid_credentials");
    }

    if (!user.isVerified) {
      throw new UnauthorizedException("email_not_verified");
    }

    await verificationService.sendLoginCode(user.id, user.email);
  }

  async confirmLogin(email: string, code: string): Promise<{ user: UserPublic; accessToken: string; refreshToken: string }> {
    const user = await userRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new NotFoundException("invalid_credentials");
    }

    await verificationService.verifyLoginCode(user.id, code);

    const { password: _password, ...publicUser } = user;
    const jwtPayload = { id: user.id, email: user.email };

    return {
      user: publicUser,
      accessToken: jwtGenerateAccessToken(jwtPayload),
      refreshToken: jwtGenerateRefreshToken(jwtPayload),
    };
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwtVerifyToken(refreshToken);

      if (!decoded.id || !decoded.email) {
        throw new UnauthorizedException("invalid_token_payload");
      }

      // Verify user still exists
      const user = await userRepository.findByEmail(decoded.email as string);
      if (!user) {
        throw new UnauthorizedException("user_not_found");
      }

      // Generate new tokens
      const jwtPayload = { id: decoded.id, email: decoded.email };
      const newAccessToken = jwtGenerateAccessToken(jwtPayload);
      const newRefreshToken = jwtGenerateRefreshToken(jwtPayload);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    }
    catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("invalid_or_expired_refresh_token");
    }
  }
}

export const authService = new AuthService();
