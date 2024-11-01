import { MailtrapClient } from"mailtrap";

const TOKEN = "6a9296e0d6015a000f5ea2b687c30be8";

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "aymanefarres6@gmail.com",
  name: "aymanefarres",
};

