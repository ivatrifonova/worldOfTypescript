import { Position as PositionInterface } from '../Interfaces/Interfaces';
import { Position } from './Position.model';
import { TeamType } from '../Enums/Enums';
import utils from '../Models/Utils.model';

export default abstract class WorldObject {
  constructor(
    private _isDestroyed: boolean = false,
    private _healthPoints: number,
    private _position: PositionInterface,
    private _canMove: boolean = true,
    private _team: TeamType = TeamType.Neutral
  ) {}

  public get team(): TeamType {
    return this._team;
  }

  public set team(team: TeamType) {
    this._team = team;
  }

  public get healthPoints(): number {
    return this._healthPoints;
  }

  public set healthPoints(points: number) {
    this.healthPoints = points;
  }

  public get isDestroyed(): boolean {
    return this._isDestroyed;
  }

  public set isDestroyed(destroyed: boolean) {
    this._isDestroyed = destroyed;
  }

  public modifyPosition(coordinates: string) {
    utils.validatePosition(coordinates);

    const position = utils.createPosition(coordinates);

    this._position = position;

    console.log(`Unit was successfully moved to position ${position.x}, ${position.y}`);
  }
  public get position(): Position {
    return this._position;
  }

  public modifyHealthPoints(points: number) {
    this._healthPoints += points;
  }
}
