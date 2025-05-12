"use client"

import * as React from "react"
import { useState } from "react"
import { IconPlus } from "@tabler/icons-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useIsMobile } from "@/hooks/use-mobile"
import { addNewVendor, checkVendorExistsByEmail, fetchAllVendor } from "@/controllers/vendors.controller"
import AddSoftwareMultiStep from "../softwares/AddSoftwareForm"
import { z } from "zod"

const vendorSchema = z.object({
  name: z.string().nonempty("Vendor name is required."),
  email: z.string().email("Please enter a valid email address."),
  companyDescription: z.string().nonempty("Company description is required."),
  website: z
    .string()
    .transform((val) => (val.startsWith("http") ? val : `https://${val}`))
    .pipe(
      z.string().refine(
        (val) => {
          try {
            const url = new URL(val);
            return url.hostname.includes("."); // Ensures there's a domain suffix
          } catch {
            return false;
          }
        },
        "Please enter a valid website URL with a domain suffix (e.g., .com, .org, .in)"
      )
    ),
  yearFounded: z.string().nonempty("Founded year is required."),
});

export function AddForm({ setAllVendors, setTotalCount, page, itemsPerPage }: { setAllVendors: any; setTotalCount: any, page: number, itemsPerPage: number }) {
  const isMobile = useIsMobile()
  const [step, setStep] = useState(1)
  const [lastCreatedVendor, setLastCreatedVendor] = useState({vendorId:"",name:""});
const [showAddSoftware, setShowAddSoftware] = useState(false);
  const [loading, setLoading] = useState(false)
  const [vendor, setVendor] = useState({
    name: "",
    email: "",
    companyDescription: "",
    website: "",
    yearFounded: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setVendor({ ...vendor, [e.target.id]: e.target.value })
  }

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (vendor.name && vendor.email) {
      // Validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(vendor.email)) {
        toast.error("Please enter a valid email address.");
        return;
      }
  
      try {
        // Directly call the service method to check if the vendor exists
        const response = await checkVendorExistsByEmail(vendor.email);
  
        console.log("Vendor Exists:",response); // Log the response
  
        if (response.success) {
          toast.error("Vendor already exists.");
          return;
        }
  
        // Proceed to the next step if vendor does not exist
        setStep(2);
      } catch (error) {
        console.error("Error checking vendor existence:", error);
        toast.error("Failed to check vendor existence. Please try again.");
      }
    } else {
      toast.error("Please fill in both name and email.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate the form data
    const result = vendorSchema.safeParse({
      name: vendor.name,
      email: vendor.email,
      companyDescription: vendor.companyDescription,
      website: vendor.website,  
      yearFounded: vendor.yearFounded
    });

    if (!result.success) {
      // Show the first error message
      const errorMessage = result.error.errors[0]?.message;
      toast.error(errorMessage || "Please check your input.");
      setLoading(false);
      return;
    }
    
    // Add website validation
    if (vendor.website) {
      // Add https:// if not present
      let websiteUrl = vendor.website;
      if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
        websiteUrl = `https://${websiteUrl}`;
      }

      // Check if URL has a valid domain suffix
      try {
        const url = new URL(websiteUrl);
        const hasValidSuffix = url.hostname.includes('.');
        if (!hasValidSuffix) {
          toast.error("Please enter a valid website URL with a domain suffix (e.g., .com, .org, .in)");
          setLoading(false);
          return;
        }
        // Update the website with the proper format
        vendor.website = websiteUrl;
      } catch (error) {
        toast.error("Please enter a valid website URL");
        setLoading(false);
        return;
      }
    }

    const randomPassword = vendor.name + '_' + vendor.yearFounded
    const newVendor = { ...vendor, password: randomPassword }

    try {
      const {response} = await addNewVendor(newVendor)
      if (!response.success) {
        console.log("response",response);
        toast.error(response.message)
        return
      }

      toast.success(response.message)
      setVendor({ name: "", email: "", companyDescription: "", website: "", yearFounded: "" })
      setStep(1)

      const { vendors, totalcount } = await fetchAllVendor(page, itemsPerPage)
      setAllVendors(vendors)
      setTotalCount(totalcount)

      console.log("response.vendor",response.vendor);
      setLastCreatedVendor(response.vendor);
      setShowAddSoftware(true);

    } catch (error: any) {
      console.error("Error adding vendor:", error)
      toast.error(error.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i)

  return (
    <>
    {showAddSoftware && lastCreatedVendor && (
     
      <AddSoftwareMultiStep
        setShowForm={setShowAddSoftware}
        onSuccess={() => setShowAddSoftware(false)}
        preselectedVendor={{
          id: lastCreatedVendor.vendorId,
          name: lastCreatedVendor.name,
        }}
      />
    )}
    {!showAddSoftware && (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden md:inline">Add Vendor</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add New Vendor</DrawerTitle>
        </DrawerHeader>
        <Separator />
        <div className="flex flex-col gap-4 p-4 text-sm">
          <form className="flex flex-col gap-4" onSubmit={step === 1 ? handleContinue : handleSubmit}>
            {step === 1 && (
              <>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="name">Vendor Name</Label>
                  <Input id="name" value={vendor.name} onChange={handleChange} required />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" id="email" value={vendor.email} onChange={handleChange} required />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="companyDescription">Company Description</Label>
                  <Input id="companyDescription" value={vendor.companyDescription} onChange={handleChange} />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" value={vendor.website} onChange={handleChange} />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="yearFounded">Founded Year</Label>
                  <select
                    id="yearFounded"
                    value={vendor.yearFounded}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 text-sm"
                  >
                    <option value="">Select Year</option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <DrawerFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : step === 1 ? "Continue" : "Submit"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
    )}
    </>
  )
}

