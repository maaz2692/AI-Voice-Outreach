import { prisma } from "../utils/prisma.js";

export type CreateScriptInput = {
  title: string;
  content: string;
  voicePreviewText?: string;
};

function cleanRequiredText(value: unknown, fieldName: string) {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string`);
  }

  const cleanedValue = value.trim();

  if (!cleanedValue) {
    throw new Error(`${fieldName} is required`);
  }

  return cleanedValue;
}

function cleanOptionalText(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const cleanedValue = value.trim();

  return cleanedValue.length > 0 ? cleanedValue : undefined;
}

export const scriptService = {
  async createScript(input: CreateScriptInput) {
    const title = cleanRequiredText(input.title, "Script title");
    const content = cleanRequiredText(input.content, "Script content");
    const voicePreviewText = cleanOptionalText(input.voicePreviewText);

    const script = await prisma.script.create({
      data: {
        title,
        content,
        voicePreviewText,
      },
    });

    return script;
  },

  async getScripts() {
    const scripts = await prisma.script.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return scripts;
  },

  async getScriptById(scriptId: string) {
    if (!scriptId) {
      throw new Error("scriptId is required");
    }

    const script = await prisma.script.findUnique({
      where: {
        id: scriptId,
      },
    });

    if (!script) {
      throw new Error("Script not found");
    }

    return script;
  },
};