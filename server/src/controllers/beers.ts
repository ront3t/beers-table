import { RequestHandler } from "express";

export const getBeersByType: RequestHandler<
  { type: string },
  unknown,
  unknown,
  { limit?: string; offset?: string }
> = async (req, res) => {
  const { type } = req.params;
  const limit = parseInt(req.query.limit || "10");
  const offset = parseInt(req.query.offset || "0");

  try {
    const response = await fetch(`https://api.sampleapis.com/beers/${type}`);
    if (!response.ok) {
      throw new Error("Failed to fetch beers from external API");
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid data format from API");
    }

    const paginated = data.slice(offset, offset + limit);

    res.status(200).json({ beers: paginated });
  } catch (error) {
    console.error("Error fetching beers:", error);
    res.status(500).json({ message: "Error fetching beers" });
  }
};
