"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/admin/multi-select";
import { fetchIndustriesOptions } from "@/controllers/industries.controller";
import { fetchFeaturesOptions } from "@/controllers/features.controller";
import { FormData, SetFormData, Testimony } from "@/types/software";

interface Props {
  formData: FormData;
  setFormData: SetFormData;
  onNext: () => void;
  onBack: () => void;
}

export default function Step5Testimonies({
  formData,
  setFormData,
  onNext,
  onBack,
}: Props) {
  const [testimonies, setTestimonies] = useState<Testimony[]>(
    formData.testimonies || []
  );
  const [industries, setIndustries] = useState<
    { industryId: string; name: string }[]
  >([]);

  useEffect(() => {
    async function loadOptions() {
      const industriesRes = await fetchIndustriesOptions();
      if (industriesRes.industries) setIndustries(industriesRes.industries);
    }
    loadOptions();
  }, []);

  // Get newly added industries from Step 2
  const newIndustries = (formData.industries || [])
    .filter((industry: any) => typeof industry === "object" && industry.name)
    .map((industry: any) => ({
      industryId: `new_${industry.name}`,
      name: industry.name,
    }));

  // Only use features that were selected in Step 3
  const selectedFeatures = (formData.key_features || []).map(
    (feature: any) => ({
      featureId: feature.featureId,
      name: feature.name,
    })
  );

  // Combine database and newly added industries
  const allIndustries = [...industries, ...newIndustries];
  const industryOptions = allIndustries.map((i) => ({
    label: i.name,
    value: i.industryId,
  }));

  // Create options array for features using only selected features
  const featureOptions = selectedFeatures.map((f) => ({
    label: f.name,
    value: f.featureId,
  }));

  const addTestimony = () => {
    setTestimonies([
      ...testimonies,
      {
        userName: "",
        companyName: "",
        designation: "",
        industry: "",
        text: "",
        featuresBenefitted: [],
      },
    ]);
  };

  const handleChange = (index: number, field: keyof Testimony, value: any) => {
    const updated = [...testimonies];
    if (field === "featuresBenefitted") {
      updated[index][field] = value;
    } else {
      updated[index][field] = value;
    }
    setTestimonies(updated);
  };

  const handleRemoveTestimony = (index: number) => {
    const updated = testimonies.filter((_, i) => i !== index);
    setTestimonies(updated);
  };

  const handleTestimoniesChange = (newTestimonies: Testimony[]) => {
    setTestimonies(newTestimonies);
    setFormData((prev: FormData) => ({
      ...prev,
      testimonies: newTestimonies,
    }));
  };

  const handleContinue = () => {
    setFormData((prev: FormData) => ({
      ...prev,
      testimonies,
    }));
    onNext();
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Step 5: User Testimonies</h2>

      {testimonies.map((item: Testimony, index: number) => (
        <div
          key={index}
          className="relative border rounded-xl bg-gray-50 p-6 flex flex-col gap-5"
        >
          {/* Discard Button */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-4 text-red-500"
            onClick={() => handleRemoveTestimony(index)}
          >
            Discard
          </Button>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label>User Name</Label>
              <Input
                value={item.userName}
                className="bg-white"
                onChange={(e) =>
                  handleChange(index, "userName", e.target.value)
                }
                placeholder="Enter user name"
              />
            </div>

            {/* Company Name field */}
            <div className="flex flex-col gap-3">
              <Label>Company Name</Label>
              <Input
                value={item.companyName}
                className="bg-white"
                onChange={(e) =>
                  handleChange(index, "companyName", e.target.value)
                }
                placeholder="Enter company name"
              />
            </div>

            {/* Designation field */}
            <div className="flex flex-col gap-3">
              <Label>Designation</Label>
              <Input
                value={item.designation}
                className="bg-white"
                onChange={(e) =>
                  handleChange(index, "designation", e.target.value)
                }
                placeholder="Enter designation (e.g., CEO, Manager)"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label>Industry</Label>
              <MultiSelect
                options={industryOptions}
                selectedValues={item.industry ? [item.industry] : []}
                onChange={(selected: string[]) =>
                  handleChange(index, "industry", selected[0] || "")
                }
                placeholder="Select industry..."
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label>Testimony</Label>
              <Textarea
                value={item.text}
                onChange={(e) => handleChange(index, "text", e.target.value)}
                className="bg-white"
                placeholder="Enter testimony"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label>Features Benefitted From</Label>
              <MultiSelect
                options={featureOptions}
                selectedValues={item.featuresBenefitted}
                onChange={(selected: string[]) =>
                  handleChange(index, "featuresBenefitted", selected)
                }
                placeholder="Select features..."
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addTestimony}
        className="w-full"
      >
        Add Testimony
      </Button>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleContinue}>Next</Button>
      </div>
    </div>
  );
}
