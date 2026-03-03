const API_URL = "http://localhost:5064/api";

export async function getAuctions() {
  const response = await fetch(`${API_URL}/Auction`);
  if (!response.ok) {
    throw new Error("Failed to fetch auctions");
  }
  return response.json();
}