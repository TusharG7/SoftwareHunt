"use client";

import React, { useState } from "react";
import Step1VendorName from "./steps/Step1VendorName";
import Step2LogoIndustries from "./steps/Step2LogoIndustries";
import Step3BusinessFeatures from "./steps/Step3BusinessFeatures";
import Step4Pricing from "./steps/Step4Pricing";
import Step5Testimonies from "./steps/Step5Testimonies";
import Step6ReviewRatings from "./steps/Step6ReviewRatings";
import Step7Snapshots from "./steps/Step7Snapshots";
import { FormData } from '@/types/software';
import { Button } from "@/components/ui/button";
import { FiX } from "react-icons/fi";

const AddSoftwareMultiStep = ({ setShowForm, onSuccess, preselectedVendor }: { setShowForm: any, onSuccess: any, preselectedVendor: any }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    vendor: null,
    vendor_id: preselectedVendor?.id || "",
    software_name: "",
    logo: null,
    description: "",
    industries: [],
    business_needs: [],
    pain_points: [],
    key_features: [],
    is_free: false,
    pricing_tiers: [],
    testimonies: [],
    softwareHuntReview: {
      pros: '',
      cons: '',
      what_we_think: "",
      ratings: {
        ease_of_use: 0,
        scalability: 0,
        budget_friendly: 0,
        customer_support: 0,
        integration_flexibility: 0,
      },
    },
    snapshots: {
      images: [],
      video: null,
    },
  });

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1VendorName
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(2)}
            onCancel={() => setShowForm(false)}
            preselectedVendor={preselectedVendor}
          />
        );
      case 2:
        return (
          <Step2LogoIndustries
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        );
      case 3:
        return (
          <Step3BusinessFeatures
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        );
      case 4:
        return (
          <Step4Pricing
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(5)}
            onBack={() => setStep(3)}
          />
        );
      case 5:
        return (
          <Step5Testimonies
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(6)}
            onBack={() => setStep(4)}
          />
        );
      case 6:
        return (
          <Step6ReviewRatings
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(7)}
            onBack={() => setStep(5)}
          />
        );
      case 7:
        return (
          <Step7Snapshots
            formData={formData}
            setFormData={setFormData}
            onBack={() => setStep(6)}
            setShowForm={() => setShowForm(false)}
            onSuccess={onSuccess}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 py-20 overflow-scroll backdrop-brightness-20 z-10">
      <div className="w-full max-w-lg p-6 mx-auto border rounded-xl shadow-sm bg-white">
        <div className="flex justify-between items-center mb-6 cursor-pointer rounded-full">
          <h2 className="text-lg font-semibold">Add Software</h2>
          <FiX onClick={() => setShowForm(false)} className="border border-gray-300 rounded-full p-1 w-8 h-8 hover:bg-gray-100" />
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className={`h-full bg-indigo-500 rounded-full transition-all`}
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>

        <div className="mb-6">{renderStep()}</div>
      </div>
    </div>
  );
};

export default AddSoftwareMultiStep;
