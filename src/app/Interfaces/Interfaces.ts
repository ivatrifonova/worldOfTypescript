import { ResourceTypes, TeamType, UnitType } from '../Enums/Enums';

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
  modifyPosition(coordinates: string): void;
  modifyHealthPoints(points: number): void;
}

export interface Engine {
  units: Unit[];
  resources: Resource[];
  gatheredResources: Resource[];

  createUnit(commands: string[], name: string): string;
  createResource(array: string[]): string;
  show(commands: string[]): string;
  order(commands: string[], name: string): string;
  create(commads: string[], name: string): string;
}

export interface Unit {
  isDestroyed: boolean;
  healthPoints: number;
  position: Position;
  canMove: boolean;
  team: TeamType;
  name: string;
  attack: number;
  defence: number;
  type: UnitType;
  canGather: boolean;

  gather(): string;
  ordinaryAttack(): string;
  ninjaAttack(): string;
  go(coordinates: string): string;
}

export interface Resource {
  isDestroyed: boolean;
  healthPoints: number;
  position: Position;
  canMove: boolean;
  team: TeamType;
  type: ResourceTypes;
}
