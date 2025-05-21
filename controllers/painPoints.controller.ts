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

  export async function fetchPainPointsSearchOptions(searchTerm?: string, page: number = 1, limit: number = 10) {
    try {
      const response = await fetch(
        `/api/private/pain-points?search=${searchTerm || ''}&page=${page}&limit=${limit}`
      );
      if (response.ok) {
        return await response.json();
      }
      return { painPoints: [] };
    } catch (error) {
      console.error("Error fetching pain points:", error);
      return { painPoints: [] };
    }
  }