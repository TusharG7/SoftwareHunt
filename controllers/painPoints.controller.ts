export async function fetchPainPointsOptions(): Promise<any> {
    try {
      const response = await fetch("/api/private/pain-points/options", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching pain points:", error);
      return { error: (error as Error).message };
    }
  }