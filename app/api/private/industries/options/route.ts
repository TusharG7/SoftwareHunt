import { NextRequest, NextResponse } from "next/server";
import { getIndustryOptions } from "@/services/industries.service";

export async function GET(request: NextRequest) {
  try {
    const options = await getIndustryOptions();
    return NextResponse.json({ industries: options }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch industries." }, { status: 500 });
  }
}