import React, { useState } from "react";
import axios from "axios";

const API_URL = 'http://127.0.0.1:8000/api';

interface UploadContractProps {
  onUploadComplete: (responseText: string) => void;
}

export default function UploadContract({ onUploadComplete }: UploadContractProps) {
  const [file, setFile] = useState<File | null>(null);

  async function handleUpload() {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      const result = reader.result?.toString();
      if (!result?.startsWith("data:")) {
        onUploadComplete("Erro ao ler o arquivo.");
        return;
      }

      const base64 = result.split(",")[1]; // extrai só o conteúdo base64
      const contentType = result.match(/^data:(.*);base64/)?.[1] || "application/octet-stream";

      try {
        const response = await axios.post(`${API_URL}/upload-contract`, {
          file_base64: base64,
          filename: file.name,
          content_type: contentType,
        });

        const responseText = response.data.analysis;
        onUploadComplete(responseText);
      } catch (err) {
        console.error(err);
        onUploadComplete("Erro ao processar o contrato. Tente novamente.");
      }
    };

    reader.onerror = () => {
      onUploadComplete("Erro ao ler o arquivo.");
    };

    reader.readAsDataURL(file); // lê o arquivo como base64
  }

  return (
    <div className="w-full p-4 border-t border-zinc-700">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button
        onClick={handleUpload}
        className="mt-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
      >
        Enviar contrato
      </button>
    </div>
  );
}


