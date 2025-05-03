"use client";

import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { CldImage } from "next-cloudinary";
import { FiUploadCloud } from "react-icons/fi";

interface ImageUploadProps {
  uploadPreset: string; // Cloudinary upload preset
  onUpload: (url: string) => void; // Callback to handle the uploaded image URL
  initialImage?: string; // Initial image URL for preview
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  uploadPreset,
  onUpload,
  initialImage = "",
}) => {
  const [imageUrl, setImageUrl] = useState<string>(initialImage);

//   const handleUpload = (result: any) => {
//     const uploadedUrl = result.info.secure_url;
//     setImageUrl(uploadedUrl); // Update the preview
//     onUpload(uploadedUrl); // Pass the URL to the parent component
//   };

  return (
    <CldUploadWidget uploadPreset={uploadPreset} onSuccess={(result:any) => {
        const uploadedUrl = result?.public_id;
        setImageUrl(uploadedUrl); // Update the preview}>
      }}>
        {({ open }) => (
          <Button type="button" className="" onClick={() => open()}>
            <FiUploadCloud className="mr-2" /> Upload Logo
          </Button>
        )}
      </CldUploadWidget>
  );
};

export default ImageUpload;