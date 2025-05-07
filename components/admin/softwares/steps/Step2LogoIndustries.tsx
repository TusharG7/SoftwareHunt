"use client";

import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { fetchIndustriesOptions } from "@/controllers/industries.controller";

// Define Zod schema for validation
const step2Schema = z.object({
  logo: z.union([z.instanceof(File), z.string().url()]).optional(),
  description: z.string().nonempty("Description is required."),
  website: z
    .string()
    .transform((val) => (val.startsWith("http") ? val : `https://${val}`))
    .pipe(z.string().url("Please enter a valid website URL.")),
  industries: z
    .array(z.string())
    .min(1, "Please select at least one industry."),
});

export default function Step2LogoIndustries({
  formData,
  setFormData,
  onBack,
  onNext,
}: {
  formData: any;
  setFormData: (data: any) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localLogoFile, setLocalLogoFile] = useState<File | null>(
    formData.logo instanceof File ? formData.logo : null
  );
  const [industries, setIndustries] = useState<
    { industryId: string; name: string }[]
  >([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
    formData.industries || []
  );
  const [newIndustry, setNewIndustry] = useState("");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [errors, setErrors] = useState<{
    logo?: string;
    description?: string;
    website?: string;
    industries?: string;
  }>({});

  useEffect(() => {
    async function loadIndustries() {
      const res = await fetchIndustriesOptions();
      if (res.industries) setIndustries(res.industries);
    }
    loadIndustries();
  }, []);

  const handleIndustrySelect = (value: string) => {
    if (!selectedIndustries.includes(value)) {
      setSelectedIndustries([...selectedIndustries, value]);
      setErrors((prev) => ({ ...prev, industries: undefined })); // Clear error
    }
  };

  const handleIndustryRemove = (industry: string) => {
    setSelectedIndustries(selectedIndustries.filter((i) => i !== industry));
  };

  const handleAddIndustry = () => {
    if (newIndustry && !industries.some((i) => i.name === newIndustry)) {
      // Generate a unique ID for the new industry
      const newIndustryId = `manual_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const updated = [
        ...industries,
        { industryId: newIndustryId, name: newIndustry },
      ];
      setIndustries(updated);
      setSelectedIndustries([...selectedIndustries, newIndustry]);
      setNewIndustry("");
    }
  };

  const handleNext = () => {
    // Validate form data with Zod
    const result = step2Schema.safeParse({
      logo: localLogoFile || undefined,
      description: formData.description || "",
      website: formData.website || "",
      industries: selectedIndustries,
    });

    if (!result.success) {
      const fieldErrors: {
        logo?: string;
        description?: string;
        website?: string;
        industries?: string;
      } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "logo") fieldErrors.logo = err.message;
        if (err.path[0] === "description")
          fieldErrors.description = err.message;
        if (err.path[0] === "website") fieldErrors.website = err.message;
        if (err.path[0] === "industries") fieldErrors.industries = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setFormData((prev: any) => ({
      ...prev,
      industries: selectedIndustries,
    }));
    onNext();
  };

  async function uploadLogo(file: File, softwareName: string) {
    const slug = softwareName.toLowerCase().replace(/\s+/g, "-");
    console.log(file, slug);

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
    formData.append("folder", `SoftwareHunt/software/${slug}`);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url; // or whatever you want to save
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">
        Step 2: Logo, Description & Industries
      </h2>

      {/* Logo Field */}
      <div className="flex flex-col gap-3">
        <Label>Logo</Label>
        <Input
          type="file"
          className="cursor-pointer"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (!file) {
              setErrors((prev) => ({
                ...prev,
                logo: "Please select an image.",
              }));
              return;
            }

            if (file.size > 500 * 1024) {
              setErrors((prev) => ({
                ...prev,
                logo: "Image size must not exceed 500KB.",
              }));
              return;
            }

            setErrors((prev) => ({ ...prev, logo: undefined }));
            setLocalLogoFile(file);

            uploadLogo(file, formData.software_name)
              .then((url) => {
                console.log("Uploaded logo URL:", url);
                setFormData((prev: any) => ({ ...prev, logo: url }));
                setUploadStatus("Image uploaded successfully!");
              })
              .catch((error) => {
                console.error("Error uploading logo:", error);
                setErrors((prev) => ({
                  ...prev,
                  logo: "Failed to upload the logo. Please try again.",
                }));
                setUploadStatus("");
              });
          }}
        />
        {formData.logo && (
          <div className="">
            <img
              src={formData.logo}
              alt="Logo preview"
              className="h-20 w-20 object-contain"
            />
          </div>
        )}
        {errors.logo && <p className="text-red-500 text-sm">{errors.logo}</p>}
        {uploadStatus && (
          <p className="text-green-500 text-sm">{uploadStatus}</p>
        )}
      </div>

      {/* Website Field */}
      <div className="flex flex-col gap-3">
        <Label>Website</Label>
        <Input
          type="url"
          value={formData.website || ""}
          onChange={(e) => {
            let value = e.target.value;

            // If user is backspacing and value is just "https://", clear it
            if (value === "https://") {
              value = "";
            }
            // If value is empty, don't add prefix
            else if (value && !value.startsWith("http")) {
              value = `https://${value}`;
            }

            setFormData((prev: any) => ({
              ...prev,
              website: value,
            }));
            setErrors((prev) => ({ ...prev, website: undefined }));
          }}
          placeholder="example.com"
        />
        {errors.website && (
          <p className="text-red-500 text-sm">{errors.website}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="flex flex-col gap-3">
        <Label>Description</Label>
        <Textarea
          value={formData.description || ""}
          onChange={(e) => {
            setFormData((prev: any) => ({
              ...prev,
              description: e.target.value,
            }));
            setErrors((prev) => ({ ...prev, description: undefined }));
          }}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      {/* Industries Field */}
      <div className="flex flex-col gap-3">
        <Label>Industries</Label>
        <Select
          onValueChange={(value) => {
            if (!selectedIndustries.includes(value)) {
              setSelectedIndustries([...selectedIndustries, value]);
              setFormData((prev: any) => ({
                ...prev,
                industries: [...(prev.industries || []), value],
              }));
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industry) => (
              <SelectItem key={industry.industryId} value={industry.name}>
                {industry.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.industries && (
          <p className="text-red-500 text-sm">{errors.industries}</p>
        )}

        <div className="flex flex-wrap gap-2">
          {selectedIndustries.map((industry) => (
            <Badge
              key={industry}
              onClick={() => handleIndustryRemove(industry)}
              className="cursor-pointer"
              variant="secondary"
            >
              {industry} ✕
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add new industry"
            value={newIndustry}
            onChange={(e) => setNewIndustry(e.target.value)}
          />
          <Button type="button" onClick={handleAddIndustry}>
            Add
          </Button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
}
