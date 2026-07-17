import { Request, Response } from "express";
import { contactService, CreateContactInput } from "../services/contact.service.js";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export const contactController = {
  async createContact(req: Request, res: Response) {
    try {
      const input = req.body as CreateContactInput;
      const contact = await contactService.createContact(input);

      return res.status(201).json({
        message: "Contact created successfully",
        data: contact,
      });
    } catch (error) {
      return res.status(400).json({
        message: getErrorMessage(error),
      });
    }
  },

  async getContacts(req: Request, res: Response) {
    try {
      const contacts = await contactService.getContacts();

      return res.status(200).json({
        message: "Contacts fetched successfully",
        data: contacts,
      });
    } catch (error) {
      return res.status(500).json({
        message: getErrorMessage(error),
      });
    }
  },
};