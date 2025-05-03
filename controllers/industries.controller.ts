export async function fetchIndustriesOptions(): Promise<any> {
  try {
    const response = await fetch("/api/private/industries/options", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      return await response.json();
    } else {
      return await response.json();
    }
  } catch (error) {
    console.error("Error fetching industries:", error);
    return { error: (error as Error).message };
  }
}
