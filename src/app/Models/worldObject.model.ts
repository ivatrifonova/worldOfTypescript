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

  get team(): TeamType {
    return this._team;
  }

  set team(team: TeamType) {
    this._team = team;
  }

  get healthPoints(): number {
    return this._healthPoints;
  }

  set healthPoints(points: number) {
    this.healthPoints = points;
  }

  get isDestroyed(): boolean {
    return this._isDestroyed;
  }

  set isDestroyed(destroyed: boolean) {
    this._isDestroyed = destroyed;
  }

  modifyPosition(coordinates: string) {
    utils.validatePosition(coordinates);

    const position = utils.createPosition(coordinates);

    this._position = position;

    console.log(`Unit was successfully moved to position ${position.x}, ${position.y}`);
  }
  get position(): Position {
    return this._position;
  }

  modifyHealthPoints(points: number) {
    this._healthPoints += points;
  }
}
