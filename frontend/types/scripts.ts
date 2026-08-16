export type Script = {
  id: string;
  title: string;
  content: string;
  voicePreviewText: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ScriptsResponse = {
  message: string;
  data: Script[];
};