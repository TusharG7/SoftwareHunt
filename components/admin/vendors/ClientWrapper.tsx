"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddForm } from "./AddVendorForm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  fetchAllVendor,
  fetchVendorById,
  updateVendor,
} from "@/controllers/vendors.controller";
import { Switch } from "@/components/ui/switch";

const ClientWrapper = ({
  vendors,
  itemsPerPage,
  totalcount,
  page,
}: {
  vendors: {
    vendor_id: string;
    name: string;
    email: string;
    website: string;
    yearFounded: string;
    companyDescription: string;
    status: string;
  }[];
  itemsPerPage: number;
  totalcount: number;
  page: number;
}) => {
  const [currentPage, setCurrentPage] = useState(page);
  const [allVendors, setAllVendors] = useState(vendors);
  const [totalCount, setTotalCount] = useState(totalcount);
  const [selectedVendor, setSelectedVendor] = useState<{
    vendor_id: string;
    name: string;
    email: string;
    website: string;
    yearFounded: string;
    companyDescription: string;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const isMobile = useIsMobile();

  // Calculate total pages
  const totalPages = Math.ceil(totalcount / itemsPerPage);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // Handle page change
  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);

    // Fetch new vendors for the selected page
    const { vendors } = await fetchAllVendor(newPage, itemsPerPage);
    setAllVendors(vendors);
  };

  // Handle row click to open the drawer with prefilled data
  const handleRowClick = (vendor: {
    vendor_id: string;
    name: string;
    email: string;
    website: string;
    yearFounded: string;
    companyDescription: string;
    status: string;
  }) => {
    setSelectedVendor(vendor);
  };

  // Handle form submission to update vendor details
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor) return;

    setLoading(true);
    try {
      const response = await updateVendor(
        selectedVendor.vendor_id,
        selectedVendor
      ); // Replace with your API call
      if (response.message) {
        toast.success("Vendor updated successfully!");

        const updatedVendor = await fetchVendorById(selectedVendor.vendor_id); // Replace with your API call to fetch a single vendor
        // Update the vendor in the table
        console.log("updatedVendor", updatedVendor);
        setAllVendors((prev) =>
          prev.map((vendor) =>
            vendor.vendor_id === updatedVendor.vendor_id
              ? updatedVendor
              : vendor
          )
        );

        // Close the drawer
        setSelectedVendor(null);
      } else {
        toast.error(response.message || "Failed to update vendor.");
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (vendorId: string, newStatus: string) => {
    try {
      // Simulate API call to update the vendor's status
      // Replace this with your actual API call
      const response = await updateVendor(vendorId, { status: newStatus });
      if (response.message) {
        toast.success("Vendor status updated successfully!");

        // Update the vendor's status in the table
        setAllVendors((prev) =>
          prev.map((vendor) =>
            vendor.vendor_id === vendorId
              ? { ...vendor, status: newStatus }
              : vendor
          )
        );
      } else {
        toast.error("Failed to update vendor status.");
      }
    } catch (error) {
      console.error("Error updating vendor status:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Vendors</h1>
        <AddForm
          setAllVendors={setAllVendors}
          setTotalCount={setTotalCount}
          page={page}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Vendor Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead>ID</TableHead> */}
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allVendors?.map((vendor) => (
              <TableRow key={vendor.vendor_id}>
                {/* <TableCell onClick={() => handleRowClick(vendor)} className="cursor-pointer">{vendor.vendor_id}</TableCell> */}
                <TableCell>
                  <button
                    className="cursor-pointer"
                    onClick={() => handleRowClick(vendor)}
                  >
                    {vendor.name}
                  </button>
                </TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {vendor.website}
                  </a>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={vendor.status === "ACTIVE"}
                    onCheckedChange={(checked) =>
                      handleStatusToggle(
                        vendor.vendor_id,
                        checked ? "ACTIVE" : "INACTIVE"
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination className="mt-10">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={currentPage === index + 1}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(index + 1);
                }}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Edit Vendor Drawer */}
      {selectedVendor && (
        <Drawer
          open={selectedVendor ? true : false}
          direction={isMobile ? "bottom" : "right"}
        >
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Edit Vendor</DrawerTitle>
            </DrawerHeader>
            <Separator />
            <div className="flex flex-col gap-4 p-4 text-sm">
              <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={selectedVendor.name}
                    onChange={(e) =>
                      setSelectedVendor({
                        ...selectedVendor,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    disabled
                    value={selectedVendor.email}
                    onChange={(e) =>
                      setSelectedVendor({
                        ...selectedVendor,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={selectedVendor.website}
                    onChange={(e) =>
                      setSelectedVendor({
                        ...selectedVendor,
                        website: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="yearFounded">Founded Year</Label>
                  <select
                    id="yearFounded"
                    value={selectedVendor.yearFounded}
                    onChange={(e) =>
                      setSelectedVendor({
                        ...selectedVendor,
                        yearFounded: e.target.value,
                      })
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="">Select Year</option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="companyDescription">
                    Company Description
                  </Label>
                  <Input
                    id="companyDescription"
                    value={selectedVendor.companyDescription}
                    onChange={(e) =>
                      setSelectedVendor({
                        ...selectedVendor,
                        companyDescription: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    value={selectedVendor.status}
                    onChange={(e) =>
                      setSelectedVendor({
                        ...selectedVendor,
                        status: e.target.value,
                      })
                    }
                  />
                </div>
                <DrawerFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update"}
                  </Button>
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedVendor(null)}
                    >
                      Cancel
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default ClientWrapper;
