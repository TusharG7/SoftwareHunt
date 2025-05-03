import { NextRequest, NextResponse } from "next/server";
import { addSoftware } from "@/services/software.service";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Call the service method to add the software
    const software = await addSoftware(formData);

    return NextResponse.json({ success: true, software }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/private/software:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Failed to add software." },
      { status: 500 }
    );
  }
}
