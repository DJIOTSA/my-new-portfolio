declare module "nodemailer" {
  interface Transporter {
    sendMail(input: {
      from: string;
      to: string;
      subject: string;
      text: string;
      html: string;
    }): Promise<unknown>;
  }

  const nodemailer: {
    createTransport(config: {
      service: string;
      auth: {
        user: string;
        pass: string;
      };
    }): Transporter;
  };

  export default nodemailer;
}
