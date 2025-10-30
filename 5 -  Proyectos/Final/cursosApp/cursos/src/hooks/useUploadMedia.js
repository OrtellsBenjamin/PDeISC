import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

/**
 * Hook para subir imágenes o videos al backend /api/upload
 * @param {string} baseUrl - URL base del backend, ej: "http://192.168.74.1:4000"
 */
export default function useUploadMedia(baseUrl = "http://192.168.74.1:4000") {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Seleccionar y subir archivo
  const pickAndUpload = async (type = "image", folder = "images") => {
    try {
      setUploading(true);
      setError(null);

      // 1️⃣ Seleccionar archivo
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          type === "video"
            ? ImagePicker.MediaTypeOptions.Videos
            : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled) {
        setUploading(false);
        return null;
      }

      const asset = result.assets[0];
      const uri = asset.uri;
      const mime = asset.mimeType || (type === "video" ? "video/mp4" : "image/jpeg");
      const name = `${Date.now()}-${type === "video" ? "video.mp4" : "image.jpg"}`;

      // 2️⃣ Enviar al backend
      const formData = new FormData();
      formData.append("file", { uri, type: mime, name });
      formData.append("folder", folder); // "images" o "videos"

      const response = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al subir archivo");

      console.log("✅ Archivo subido:", data.url);
      return data.url; // URL pública del archivo
    } catch (e) {
      console.error("💥 Error subiendo archivo:", e.message);
      setError(e.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { pickAndUpload, uploading, error };
}
