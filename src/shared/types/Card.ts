import { CardMedia } from "../../components/packages/types/CardMedia";

export interface Card {
  id: string;
  recto: string;
  verso: string;
}

export interface CardWithMedia extends Card {
  medias: CardMedia | undefined;
}
