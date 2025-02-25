export interface Card {
  id: number;
  imageUrl: string;
  flipped: boolean;
  matched: boolean;
}

export interface GameInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  path: string;
  tags: string[];
  lastPlayed?: Date;
}

export type Difficulty = "easy" | "medium" | "hard";

export type Theme = "animals" | "food" | "space" | "tech";
