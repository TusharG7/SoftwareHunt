"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/admin/multi-select";
import { fetchIndustriesOptions } from "@/controllers/industries.controller";
import { fetchFeaturesOptions } from "@/controllers/features.controller";

type Testimony = {
  userName: string;
  industry: string;
  text: string;
  featuresBenefitted: string[];
};

export default function Step5Testimonies({
  formData,
  setFormData,
  onNext,
  onBack,
}: {
  formData: any;
  setFormData: (val: any) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [testimonies, setTestimonies] = useState<Testimony[]>(
    formData.testimonies || []
  );
  const [industries, setIndustries] = useState<{ industryId: string, name: string }[]>([]);
  const [features, setFeatures] = useState<{ featureId: string, name: string }[]>([]);

  useEffect(() => {
    async function loadOptions() {
      const industriesRes = await fetchIndustriesOptions();
      if (industriesRes.industries) setIndustries(industriesRes.industries);

      const featuresRes = await fetchFeaturesOptions();
      if (featuresRes.features) setFeatures(featuresRes.features);
    }
    loadOptions();
  }, []);

  // Get newly added industries from Step 2
  const newIndustries = (formData.industries || [])
    .filter((industry: any) => typeof industry === 'object' && industry.name)
    .map((industry: any) => ({
      industryId: `new_${industry.name}`,
      name: industry.name
    }));

  // Get newly added features from Step 3
  const newFeatures = (formData.key_features || [])
    .filter((feature: any) => typeof feature === 'object' && feature.name)
    .map((feature: any) => ({
      featureId: `new_${feature.name}`,
      name: feature.name
    }));

  // Combine database and newly added options
  const allIndustries = [...industries, ...newIndustries];
  const allFeatures = [...features, ...newFeatures];

  const industryOptions = allIndustries.map(i => ({ label: i.name, value: i.industryId }));
  const featureOptions = allFeatures.map(f => ({ label: f.name, value: f.featureId }));

  const addTestimony = () => {
    setTestimonies([
      ...testimonies,
      { userName: "", industry: "", text: "", featuresBenefitted: [] },
    ]);
  };

  const handleChange = (index: number, field: keyof Testimony, value: any) => {
    const updated = [...testimonies];
    updated[index][field] = value;
    setTestimonies(updated);
  };

  const handleRemoveTestimony = (index: number) => {
    const updated = testimonies.filter((_, i) => i !== index);
    setTestimonies(updated);
  };

  const handleContinue = () => {
    setFormData((prev: any) => ({
      ...prev,
      testimonies,
    }));
    onNext();
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Step 5: User Testimonies</h2>

      {testimonies.map((item, index) => (
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
                onChange={(e) =>
                  handleChange(index, "userName", e.target.value)
                }
                placeholder="Enter user name"
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
