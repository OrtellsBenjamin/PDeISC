import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

/**

  @param {string} baseUrl 
 */
export default function useUploadMedia(baseUrl = "https://onlearn-api.onrender.com:4000") {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Seleccionar y subir archivo
  const pickAndUpload = async (type = "image", folder = "images") => {
    try {
      setUploading(true);
      setError(null);

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

      //Enviar al backend
      const formData = new FormData();
      formData.append("file", { uri, type: mime, name });
      formData.append("folder", folder); /

      const response = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al subir archivo");

      return data.url;
    } catch (e) {
      console.error("Error subiendo archivo:", e.message);
      setError(e.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { pickAndUpload, uploading, error };
}
