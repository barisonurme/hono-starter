import { InternalServerErrorException } from "@/exceptions/http-exceptions";
import { sendMail } from "@/utils/mailer";

export class EmailService {
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await sendMail({ to, subject, html });
    }
    catch {
      throw new InternalServerErrorException("failed_to_send_email");
    }
  }
}

export const emailService = new EmailService();
