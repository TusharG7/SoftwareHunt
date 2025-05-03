import { NextRequest, NextResponse } from "next/server";
import { getPainPointsOptions } from "@/services/painPoints.service";

export async function GET(request: NextRequest) {
  try {
    const options = await getPainPointsOptions();
    return NextResponse.json({ painPoints: options }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pain points." }, { status: 500 });
  }
}
