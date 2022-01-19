import { TeamType } from '../Enums/Enums';

export interface Position {
  x: number;
  y: number;
}

export interface TeamData {
  food: number;
  lumber: number;
  iron: number;
}

export interface FightDamage {
  defenderDamage: number;
  attackerDamage: number;
}

export interface WorldObject {
  isDestroyed: boolean;
  healthPoints: number;
  position: Position;
  canMove: boolean;
  team: TeamType;
}
