import { InternalServerErrorException } from "@/exceptions/http-exceptions";
import { sendMail } from "@/utils/mailer";

export class EmailService {
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await sendMail({ to, subject, html });
    }
    catch {
      throw new InternalServerErrorException("Failed to send email");
    }
  }
}

export const emailService = new EmailService();
