export type FavoriteType = "GAME" | "CONSOLE";

export interface FavoriteInput {
  itemId: number;
  itemType: FavoriteType;
}

export interface FavoriteResponse {
  id: number;
  userId: number;
  itemId: number;
  itemType: FavoriteType;
  createdAt: Date;
}
