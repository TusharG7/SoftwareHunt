export async function fetchBusinessNeedsOptions(): Promise<any> {
  try {
    const response = await fetch("/api/private/business-needs/options", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching business needs:", error);
    return { error: (error as Error).message };
  }
}
