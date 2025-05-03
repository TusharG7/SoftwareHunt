export async function fetchFeaturesOptions(): Promise<any> {
  try {
    const response = await fetch("/api/private/features/options", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching features:", error);
    return { error: (error as Error).message };
  }
}
