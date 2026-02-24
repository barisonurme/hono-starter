export function verifyEmailTemplate(CODE_EXPIRY_MINUTES?: number, code?: string) {
  return { subject: "Verify your email address", template: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Use the code below to verify your email address. It expires in ${CODE_EXPIRY_MINUTES} minutes.</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px 0;">
            ${code}
          </div>
          <p style="color: #888; font-size: 13px;">If you did not create an account, ignore this email.</p>
        </div>
      ` };
}

export function verifyLoginTemplate(CODE_EXPIRY_MINUTES?: number, code?: string) {
  return { subject: "Your login verification code", template: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Login Verification</h2>
          <p>Use the code below to complete your sign-in. It expires in ${CODE_EXPIRY_MINUTES} minutes.</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px 0;">
            ${code}
          </div>
          <p style="color: #888; font-size: 13px;">If you did not attempt to sign in, please secure your account immediately.</p>
        </div>
      ` };
}
