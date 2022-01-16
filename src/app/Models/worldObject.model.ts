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

  get healthPoints(): number {
    return this._healthPoints;
  }

  modifyPosition(coordinates: string) {
      const convertedCoordinates = utils.convertCoordinatesFromStringToNumber(coordinates);

      utils.validatePosition(convertedCoordinates);

      const position = utils.createPosition(convertedCoordinates);

      this._position = position;

      console.log(`Unit was succsesfuly move to position ${position}`);
 
   
  }
  get position():Position {
    return this._position;
  }
  
  modifyHealthPoints(points:number) {
    this._healthPoints = points;
  }
}
