import { prisma } from "../utils/prisma.js";

export type CreateContactInput = {
  name: string;
  phone: string;
  email?: string;
  company?: string;
};

function cleanOptionalText(value?: string) {
  if (!value) {
    return undefined;
  }

  const cleanedValue = value.trim();

  return cleanedValue.length > 0 ? cleanedValue : undefined;
}

export const contactService = {
  async createContact(input: CreateContactInput) {
    const name = input.name?.trim();
    const phone = input.phone?.trim();

    if (!name) {
      throw new Error("Contact name is required");
    }

    if (!phone) {
      throw new Error("Contact phone is required");
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        phone,
        email: cleanOptionalText(input.email),
        company: cleanOptionalText(input.company),
      },
    });

    return contact;
  },

  async getContacts() {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return contacts;
  },
};