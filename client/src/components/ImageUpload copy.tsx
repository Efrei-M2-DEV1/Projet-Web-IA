import { useRef, useState } from "react";
import { createImagePreview } from "../services/api";

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  isLoading?: boolean;
}

export const ImageUpload = ({
  onImageSelect,
  isLoading = false,
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image valide");
      return;
    }

    try {
      const previewUrl = await createImagePreview(file);
      setPreview(previewUrl);
      onImageSelect(file, previewUrl);
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier:", error);
      alert("Erreur lors de la lecture de l'image");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (preview) {
    return (
      <div className="relative w-full max-w-md">
        <div className="relative rounded-[3rem] md:rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white">
          <img
            src={preview}
            alt="Aperçu"
            className="w-full h-auto max-h-[60vh] md:max-h-96 object-contain bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50"
          />
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleReset}
            disabled={isLoading}
            className="px-8 py-5 bg-white active:bg-gray-50 text-gray-800 rounded-[2rem] font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xl touch-manipulation min-h-[60px] border-2 border-gray-200"
          >
            Changer l'image
          </button>
          {isLoading && (
            <div className="flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-[2rem] min-h-[60px] shadow-xl">
              <svg
                className="animate-spin h-7 w-7"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-lg font-bold">Analyse en cours...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        relative w-full max-w-md
        transition-all duration-200 cursor-pointer touch-manipulation
        min-h-[500px] md:min-h-[450px] flex items-center justify-center
        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInput}
        className="hidden"
        disabled={isLoading}
      />

      <div className="flex flex-col items-center justify-center text-center space-y-10 w-full px-8">
        <div
          className={`
          w-48 h-48 md:w-40 md:h-40 rounded-full flex items-center justify-center
          ${
            dragActive
              ? "bg-white/30 scale-110 backdrop-blur-md"
              : "bg-white/20 backdrop-blur-sm"
          }
          transition-all duration-200 shadow-2xl border-4 border-white/30
        `}
        >
          <svg
            className="w-24 h-24 md:w-20 md:h-20 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        <div className="space-y-3">
          <p className="text-4xl md:text-3xl font-black text-white mb-2 drop-shadow-lg">
            Prendre une photo
          </p>
          <p className="text-xl md:text-lg text-white/90 font-semibold drop-shadow-md">
            ou choisir depuis la galerie
          </p>
        </div>
      </div>
    </div>
  );
};
