import {
  Position as PositionInterface,
  WorldObject as WorldObjectInterface,
} from '../Interfaces/Interfaces';
import { Position } from './Position';
import { TeamType } from '../Enums/Enums';
import { createPosition } from './Utils';

export default abstract class WorldObject implements WorldObjectInterface {
  private _isDestroyed: boolean;
  private _healthPoints: number;
  private _position: PositionInterface;
  private _canMove: boolean;
  private _team: TeamType = TeamType.Neutral;

  public get team(): TeamType {
    return this._team;
  }

  public set team(team: TeamType) {
    this._team = team;
  }

  public get canMove(): boolean {
    return this._canMove;
  }

  public get healthPoints(): number {
    return this._healthPoints;
  }

  public set healthPoints(points: number) {
    this._healthPoints = points;
  }

  public get isDestroyed(): boolean {
    return this._isDestroyed;
  }

  public set isDestroyed(destroyed: boolean) {
    this._isDestroyed = destroyed;
  }

  public get position(): Position {
    return this._position;
  }

  public set position(position: Position) {
    this._position = position;
  }

  constructor(
    isDestroyed: boolean,
    healthPoints: number,
    position: PositionInterface,
    canMove: boolean,
    team: TeamType
  ) {
    this._isDestroyed = isDestroyed;
    this._healthPoints = healthPoints;
    this._position = position;
    this._canMove = canMove;
    this._team = team;
  }
  
  public modifyPosition(coordinates: string) {
    const position = createPosition(coordinates);

    this.position = position;
  }

  public modifyHealthPoints(points: number) {
    this.healthPoints -= points;

    if (this.healthPoints <= 0) {
      this.isDestroyed = true;
    }
  }
}
