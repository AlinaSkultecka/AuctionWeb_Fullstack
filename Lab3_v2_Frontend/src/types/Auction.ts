export type Auction = {
  auctionId: number;
  bookTitle: string;
  author: string;
  description: string;
  imageUrl: string | null;
  endDate: string;
  currentPrice: number;
  creatorUserName: string;
  isActive: boolean;
  isOpen: boolean;
};