// utils/api.ts
export async function fetchStats() {
  try {
    const res = await fetch("https://api.harekrishnavidya.org/api/stats/", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch stats");
    }

    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching stats:", error);
    return [];
  }
}

export async function fetchTestimonials() {
  try {
    const res = await fetch("https://api.harekrishnavidya.org/api/testimonials/", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch testimonials");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}
