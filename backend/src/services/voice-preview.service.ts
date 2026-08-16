import { randomUUID } from "crypto";
import { prisma } from "../utils/prisma.js";

type GenerateVoicePreviewInput = {
  scriptId: string;
};

function sleep(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function estimateDurationSeconds(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const averageWordsPerMinute = 150;
  const durationSeconds = (words.length / averageWordsPerMinute) * 60;

  return Math.max(1,Math.round(durationSeconds)
  );
}

export const voicePreviewService = {
  async generatePreview( input: GenerateVoicePreviewInput ) {
    if (
      typeof input.scriptId !== "string" || !input.scriptId.trim()
    ) {
      throw new Error("scriptId is required");
    }

    const script = await prisma.script.findUnique({
      where: {
        id: input.scriptId,
      },
    });

    if (!script) {
      throw new Error("Script not found");
    }

    const previewText =
      script.voicePreviewText?.trim() ||
      script.content.trim();

    await sleep(800);

    return {
      previewId: randomUUID(),
      scriptId: script.id,
      scriptTitle: script.title,
      text: previewText,
      voiceName: "Mock Voice",
      provider: "mock",
      status: "ready",
      estimatedDurationSeconds: estimateDurationSeconds(previewText),
      audioUrl: null,
    };
  },
};