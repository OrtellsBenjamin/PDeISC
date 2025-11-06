import { Platform } from "react-native";

// Hook personalizado para manejar la carga de archivos (imágenes o videos)
export default function useUploadHelper(UPLOAD_FILE_URL, session) {
  
  // Detecta el tipo MIME según la extensión del archivo
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

  // Obtiene el nombre del archivo a partir de la URI
  const fileNameFromUri = (uri, fallback) => {
    try {
      const parts = uri.split("/");
      const name = parts[parts.length - 1] || fallback;
      return name;
    } catch {
      return fallback;
    }
  };

  // Convierte un blob en un objeto File (solo para entorno web)
  const blobToFile = async (blobUri, fileName, mimeType) => {
    const response = await fetch(blobUri);
    const blob = await response.blob();
    return new File([blob], fileName, { type: mimeType });
  };

  // Realiza la carga del archivo al servidor
  const uploadFile = async (uri, kind) => {
    const form = new FormData();
    const name = fileNameFromUri(uri, kind === "image" ? "portada.jpg" : "video.mp4");
    const type = guessMimeFromUri(uri, kind);

    // Maneja carga en web y en dispositivos nativos
    if (Platform.OS === "web" && uri.startsWith("blob:")) {
      const file = await blobToFile(uri, name, type);
      form.append("file", file);
    } else {
      form.append("file", { uri, name, type });
    }

    // Define la carpeta de destino según el tipo de archivo
    form.append("folder", kind === "image" ? "images" : "videos");

    // Envia el archivo al endpoint configurado
    const res = await fetch(UPLOAD_FILE_URL, {
      method: "POST",
      headers: {
        ...(Platform.OS !== "web" ? { "Content-Type": "multipart/form-data" } : {}),
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: form,
    });

    // Procesa la respuesta
    const data = await res.json();
    if (!res.ok || !data?.url) {
      throw new Error(data?.error || `No se pudo subir el ${kind}.`);
    }

    return data.url;
  };

  // Devuelve las funciones disponibles para otros componentes
  return { uploadFile, fileNameFromUri };
}
