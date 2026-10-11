import type { Player } from "./player";

export interface PlayerRepository {
  findAll(): Player[];
}
