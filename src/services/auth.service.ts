import type { UserPrivate, UserPublic } from "@/models/user.model";

import { NotFoundException } from "@/exceptions/http-exceptions";
import { userRepository } from "@/models/user.repo";

export class AuthService {
  async validateUser(email: string): Promise<UserPrivate> {
    const user = await userRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async validatePassword(email: string, password: string): Promise<UserPublic> {
    const user = await this.validateUser(email);

    if (!password) {
      throw new NotFoundException("Password is required");
    }

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isPasswordValid = await userRepository.validatePasswordWithEmail(email, password);

    if (!isPasswordValid) {
      throw new NotFoundException("Invalid password");
    }

    const { passwordHash: _password, ...publicUser } = user;
    return publicUser as UserPublic;
  }
}

export const authService = new AuthService();
