export type FavoriteType = "GAME" | "CONSOLE";

export interface Favorite {
  id: number;
  userId: number;
  itemId: number;
  itemType: FavoriteType;
  createdAt: Date;
}

export interface FavoriteInput {
  itemId: number;
  itemType: FavoriteType;
}
