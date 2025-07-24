// components/ProfileSetup/ProfileImageUploader.tsx
import { useRef } from "react";
import { Camera } from "lucide-react";

export default function ProfileImageUploader({
  value,
  onChange,
}: {
  value: File | null;
  onChange: (file: File) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <div
        className="w-24 h-24 rounded-xl bg-gray-100 border flex items-center justify-center relative overflow-hidden cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {value ? (
          <img
            src={URL.createObjectURL(value)}
            alt="Profile Preview"
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-sm text-gray-500">Upload</span>
        )}
        <div className="absolute bottom-1 right-1 bg-green-600 p-1 rounded-full text-white cursor-pointer">
          <Camera size={14} />
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
