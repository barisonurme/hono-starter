import type { UserPublic } from "@/models/user.model";

import { BadRequestException } from "@/exceptions/http-exceptions";
import { userRepository } from "@/models/user.repo";
import { verificationRepository } from "@/models/verification.repo";
import { emailService } from "@/services/email.service";
import { verifyEmailTemplate, verifyLoginTemplate } from "@/templates/auth-templates";

const CODE_EXPIRY_MINUTES = 15;

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export class VerificationService {
  async sendVerificationCode(userId: string, email: string): Promise<void> {
    const code = generateCode();
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

    await verificationRepository.deleteByUserId(userId);
    await verificationRepository.createCode(userId, code, expiresAt);

    await emailService.sendEmail(
      email,
      verifyEmailTemplate().subject,
      verifyEmailTemplate(CODE_EXPIRY_MINUTES, code).template,
    );
  }

  async verifyCode(email: string, code: string): Promise<UserPublic> {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestException("Invalid or expired verification code");
    }

    const record = await verificationRepository.findValidCode(user.id, code);

    if (!record) {
      throw new BadRequestException("Invalid or expired verification code");
    }

    await verificationRepository.markUsed(record.id);
    const [verified] = await userRepository.updateUser(user.id, { isVerified: true, updatedAt: new Date() });
    return verified;
  }

  async sendLoginCode(userId: string, email: string): Promise<void> {
    const code = generateCode();
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

    await verificationRepository.deleteByUserId(userId);
    await verificationRepository.createCode(userId, code, expiresAt);

    await emailService.sendEmail(
      email,
      verifyLoginTemplate().subject,
      verifyLoginTemplate(CODE_EXPIRY_MINUTES, code).template,
    );
  }

  async verifyLoginCode(userId: string, code: string): Promise<void> {
    const record = await verificationRepository.findValidCode(userId, code);

    if (!record) {
      throw new BadRequestException("Invalid or expired login code");
    }

    await verificationRepository.markUsed(record.id);
  }
}

export const verificationService = new VerificationService();
