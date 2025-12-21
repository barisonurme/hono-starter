import type { UserPrivate, UserPublic } from "@/models/user.model";

import { NotFoundException, UnauthorizedException } from "@/exceptions/http-exceptions";
import { userRepository } from "@/models/user.repo";
import { jwtGenerateAccessToken, jwtGenerateRefreshToken, jwtVerifyToken } from "@/utils";

export class AuthService {
  async validateUser(email: string, isLoginRequest?: boolean): Promise<UserPrivate> {
    const user = await userRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new NotFoundException(isLoginRequest ? "Invalid credentials" : "User not found");
    }

    return user;
  }

  async validatePassword(
    email: string,
    password: string,
    isLoginRequest?: boolean,
  ): Promise<{ user: UserPublic; accessToken: string; refreshToken: string }> {
    const user = await this.validateUser(email, isLoginRequest);

    if (!password) {
      throw new NotFoundException("Password is required");
    }

    const isPasswordValid = await userRepository.validatePasswordWithEmail(email, password);

    if (!isPasswordValid) {
      throw new NotFoundException("Invalid password");
    }

    const { passwordHash: _password, ...publicUser } = user;

    /* Generate JWT tokens */
    const jwtPayload = { id: user.id, email: user.email };

    const accessToken = jwtGenerateAccessToken(jwtPayload);
    const refreshToken = jwtGenerateRefreshToken(jwtPayload);

    return {
      user: publicUser,
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwtVerifyToken(refreshToken);

      if (!decoded.id || !decoded.email) {
        throw new UnauthorizedException("Invalid token payload");
      }

      // Verify user still exists
      const user = await userRepository.findByEmail(decoded.email as string);
      if (!user) {
        throw new UnauthorizedException("User not found");
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
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }
}

export const authService = new AuthService();
