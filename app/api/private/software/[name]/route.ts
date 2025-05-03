import { NextRequest, NextResponse } from "next/server";
import { doesSoftwareNameExist } from "@/services/software.service";

export async function GET(request: NextRequest) {
  try {
    // Extract software name from the URL
    const url = new URL(request.url);
    const name = decodeURIComponent(url.pathname.split("/").at(-1) || "");

    if (!name) {
      return NextResponse.json(
        { error: "Software name is required." },
        { status: 400 }
      );
    }

    // Call the service method
    const exists = await doesSoftwareNameExist(name);

    // Return the result
    return NextResponse.json({ exists }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /software/check/[name]:", error);
    return NextResponse.json(
      { error: "Failed to check if software exists. " + error },
      { status: 500 }
    );
  }
}
