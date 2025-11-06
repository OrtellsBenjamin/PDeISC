
import { Platform } from "react-native";

export default function useUploadHelper(UPLOAD_FILE_URL, session) {
  
  const guessMimeFromUri = (uri, kind) => {
    const lower = (uri || "").toLowerCase();
    if (kind === "image") {
      if (lower.endsWith(".png")) return "image/png";
      if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
      if (lower.endsWith(".webp")) return "image/webp";
      return "image/jpeg";
    }
    if (lower.endsWith(".mov")) return "video/quicktime";
    if (lower.endsWith(".mkv")) return "video/x-matroska";
    if (lower.endsWith(".webm")) return "video/webm";
    return "video/mp4";
  };

  const generateUniqueFileName = (kind) => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const extension = kind === "image" ? "jpg" : "mp4";
    return `${kind}-${timestamp}-${randomId}.${extension}`;
  };

  const fileNameFromUri = (uri, fallback) => {
    try {
      const parts = uri.split("/");
      const name = parts[parts.length - 1] || fallback;
      return name;
    } catch {
      return fallback;
    }
  };

  const blobToFile = async (blobUri, fileName, mimeType) => {
    const response = await fetch(blobUri);
    const blob = await response.blob();
    return new File([blob], fileName, { type: mimeType });
  };

  const uploadFile = async (uri, kind) => {
    const form = new FormData();
    const name = generateUniqueFileName(kind);
    const type = guessMimeFromUri(uri, kind);

    if (Platform.OS === "web" && uri.startsWith("blob:")) {
      const file = await blobToFile(uri, name, type);
      form.append("file", file);
    } else {
      form.append("file", { uri, name, type });
    }

    form.append("folder", kind === "image" ? "images" : "videos");

    const res = await fetch(UPLOAD_FILE_URL, {
      method: "POST",
      headers: {
        ...(Platform.OS !== "web" ? { "Content-Type": "multipart/form-data" } : {}),
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: form,
    });

    const data = await res.json();
    if (!res.ok || !data?.url) {
      throw new Error(data?.error || `No se pudo subir el ${kind}.`);
    }

    return data.url;
  };

  return { uploadFile, fileNameFromUri };
}
