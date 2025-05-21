import { NextRequest, NextResponse } from "next/server";
import { searchPainPoints } from "@/services/painPoints.service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await searchPainPoints(searchTerm, page, limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in GET /pain-points:", error);
    return NextResponse.json(
      { error: "Failed to fetch pain points" },
      { status: 500 }
    );
  }
}