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

export async function fetchFeaturesSearchOptions(searchTerm?: string, page: number = 1, limit: number = 10) {
  try {
    const response = await fetch(
      `/api/private/features?search=${searchTerm || ''}&page=${page}&limit=${limit}`
    );
    if (response.ok) {
      return await response.json();
    }
    return { features: [] };
  } catch (error) {
    console.error("Error fetching features:", error);
    return { features: [] };
  }
}