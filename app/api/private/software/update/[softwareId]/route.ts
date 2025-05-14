// Create file app/api/private/software/[softwareId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { updateSoftwareStatus } from "@/services/software.service";

export async function PUT(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Extract softwareId from the URL
    const url = new URL(request.url);
    const softwareId = url.pathname.split("/").at(-1);

    if (!softwareId) {
      return NextResponse.json(
        { error: "Software ID is required." },
        { status: 400 }
      );
    }

    // Validate status field
    const { status } = body;
    if (!status) {
      return NextResponse.json(
        { error: "Status is required." },
        { status: 400 }
      );
    }

    // Call the updateSoftwareStatus service method
    const result = await updateSoftwareStatus(softwareId, status);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    // Return success response
    return NextResponse.json(
      { message: result.message },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /software/[softwareId]:", error);
    return NextResponse.json(
      { error: "Failed to update software status. " + error },
      { status: 500 }
    );
  }
}