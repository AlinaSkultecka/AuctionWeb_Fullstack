const BASE_URL = "http://localhost:5064/api";
const AUCTION_URL = `${BASE_URL}/Auction`;
const BID_URL = `${BASE_URL}/Bid`;

// ================= HELPERS =================

function authHeaders(token?: string) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// ================= CREATE AUCTION =================

export async function createAuction(auction: any, token: string) {
  const response = await fetch(AUCTION_URL, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(auction)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to create auction");
  }

  return response.json();
}

// ================= GET ALL AUCTIONS =================

export async function getAuctions() {
  const response = await fetch(AUCTION_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch auctions");
  }

  return response.json();
}

// ================= GET AUCTION BY ID =================

export async function getAuctionById(id: string) {
  const response = await fetch(`${AUCTION_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch auction");
  }

  return response.json();
}

// ================= UPDATE AUCTION =================

export async function updateAuction(
  id: string,
  auction: any,
  token: string
) {
  const response = await fetch(`${AUCTION_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(auction)
  });

  if (!response.ok) {
    throw new Error("Failed to update auction");
  }
}

// ================= ADMIN GET AUCTIONS =================

export async function getAuctionsAdmin(token: string) {
  const response = await fetch(AUCTION_URL, {
    headers: authHeaders(token)
  });

  if (!response.ok) {
    throw new Error("Failed to fetch auctions");
  }

  return response.json();
}

// ================= DEACTIVATE AUCTION =================

export async function deactivateAuction(id: number, token: string) {
  const response = await fetch(`${AUCTION_URL}/deactivate/${id}`, {
    method: "PUT",
    headers: authHeaders(token)
  });

  if (!response.ok) {
    throw new Error("Failed to deactivate auction");
  }
}

// ================= REACTIVATE AUCTION =================

export async function reactivateAuction(id: number, token: string) {
  const response = await fetch(`${AUCTION_URL}/reactivate/${id}`, {
    method: "PUT",
    headers: authHeaders(token)
  });

  if (!response.ok) {
    throw new Error("Failed to reactivate auction");
  }
}

// ================= DELETE AUCTION =================

export async function deleteAuction(id: number, token: string) {
  const response = await fetch(`${AUCTION_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(token)
  });

  if (!response.ok) {
    throw new Error("Failed to delete auction");
  }
}

// ================= PLACE BID =================

export async function placeBid(
  auctionId: number,
  amount: number,
  token: string
) {
  const response = await fetch(BID_URL, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ auctionId, amount })
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "Failed to place bid");
  }

  return JSON.parse(text);
}