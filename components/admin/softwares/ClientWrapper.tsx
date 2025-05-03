"use client"

import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import AddSoftwareMultiStep from "./AddSoftwareForm"

const Page = () => {
  const [softwares, setSoftwares] = useState([
    {
      id: 1,
      name: "Software 1",
      website: "https://software1.com",
      rating: 4.5,
      category: "Productivity",
      status: "Active",
      vendor: "Vendor 1",
      updated_at: "2025-03-20",
    },
    {
      id: 2,
      name: "Software 2",
      website: "https://software2.com",
      rating: 3.8,
      category: "Finance",
      status: "Inactive",
      vendor: "Vendor 2",
      updated_at: "2025-03-18",
    },
  ])

  const [showForm, setShowForm] = useState(false)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Softwares</h1>
        <Button onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Close Form" : "Add New Software"}
        </Button>
      </div>

      {/* Conditionally render multi-step form */}
      {showForm && (
        <div className="mb-6">
          <AddSoftwareMultiStep setShowForm={setShowForm} />
        </div>
      )}

      {/* Software Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {softwares.map((software) => (
              <TableRow key={software.id}>
                <TableCell>{software.id}</TableCell>
                <TableCell>{software.name}</TableCell>
                <TableCell>
                  <a
                    href={software.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {software.website}
                  </a>
                </TableCell>
                <TableCell>{software.rating}</TableCell>
                <TableCell>{software.category}</TableCell>
                <TableCell>{software.status}</TableCell>
                <TableCell>{software.vendor}</TableCell>
                <TableCell>{software.updated_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Page
