import React, { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { addNewSoftware } from "@/controllers/software.controller";

export default function Step7Snapshots({
  formData,
  setFormData,
  onBack,
  setShowForm,
}: {
  formData: any;
  setFormData: (val: any) => void;
  onBack: () => void;
  setShowForm: (val: boolean) => void;
}) {
  const [images, setImages] = useState<File[]>(
    formData.snapshots?.images || []
  );
  const [video, setVideo] = useState<File | null>(
    formData.snapshots?.video || null
  );
  const [loading, setLoading] = useState(false); // State to track loading status


  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "unsigned_preset"
    );
    formData.append(
      "cloud_name",
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""
    );
    formData.append("folder", folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url; // Return the uploaded file's URL
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }
    setImages([...images, ...files]);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setVideo(file);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 1. Upload images and video to Cloudinary
      const slug = formData.software_name.toLowerCase().replace(/\s+/g, "-");
      const uploadedImageUrls = await Promise.all(
        images.map((image) => uploadToCloudinary(image, `SoftwareHunt/software/${slug}/software_snapshots`))
      );
      let uploadedVideoUrl = null;
      if (video) {
        uploadedVideoUrl = await uploadToCloudinary(
          video,
          `SoftwareHunt/software/${slug}/software_snapshots`
        );
      }

      // 2. Build the new formData with updated snapshots
      const finalFormData = {
        ...formData,
        snapshots: {
          images: uploadedImageUrls,
          video: uploadedVideoUrl,
        },
      };

      // 3. Optionally update state for UI (not required for submission)
      setFormData(finalFormData);

      // 4. Now call the controller to add the software
      const result = await addNewSoftware(finalFormData);

      if (result.success) {
        setShowForm(false);
        toast.success("Software added successfully!");
      } else {
        toast.error(result.error || "Failed to add software.");
      }
    } catch (error) {
      console.error("Error submitting software:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Step 7: Upload Snapshots</h2>

      <div className="space-y-2">
        <Label>Upload up to 5 Images</Label>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="block"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {images.map((file, index) => (
            <div key={index} className="relative w-24 h-24 border rounded">
              <img
                src={URL.createObjectURL(file)}
                alt={`snapshot-${index}`}
                className="w-full h-full object-cover rounded"
              />
              <button
                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                onClick={() => removeImage(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Upload 1 Video</Label>
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          className="block"
        />
        {video && (
          <video
            src={URL.createObjectURL(video)}
            controls
            className="w-64 h-auto mt-2 rounded"
          />
        )}
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader className="animate-spin" size={16} />
              Processing...
            </div>
          ) : (
            "Finish"
          )}
        </Button>
      </div>
    </div>
  );
}
