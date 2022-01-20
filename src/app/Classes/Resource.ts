import WorldObject from './worldObject';
import { ResourceTypes, TeamType } from '../Enums/Enums';
import { Position as PositionInterface, Resource as ResourceInterface} from '../Interfaces/Interfaces';

export class Resource extends WorldObject implements ResourceInterface {
  private _type: ResourceTypes;

  public get type(): ResourceTypes {
    return this._type;
  }

  constructor(
    isDestroyed: boolean,
    healthPoints: number,
    position: PositionInterface,
    canMove: boolean,
    team: TeamType,
    type: ResourceTypes
  ) {
    super(isDestroyed, healthPoints, position, canMove, team);
    this._type = type;
  }
}
