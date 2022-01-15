import { Position as PositionInterface } from '../Interfaces/Interfaces';
import { Position } from './Position.model';
import { TeamType } from '../Enums/Enums';
import utils from '../Models/Utils.model';

export default abstract class WorldObject {
  constructor(
    private _isDestroyed: boolean,
    private _healthPoints: number,
    private _position: PositionInterface,
    private _canMove: boolean = true,
    private _team: TeamType = TeamType.Neutral
  ) {}
  modifyPosition(position: string) {
    const coordinates = utils.convertCoordinatesFromStringToNumber(position);
    const newCoordinatesObject = new Position(coordinates[0], coordinates[1]);
    this._position = newCoordinatesObject;
    console.log(`Unit was succsesfuly move to position ${position}`);
  }
  get position():Position {
    return this._position;
  }
  modifyHealthPoints(points:number) {
    this._healthPoints = points;
  }
}
