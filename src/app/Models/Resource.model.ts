import WorldObject from './worldObject.model';
import { ResourceTypes, TeamType } from '../Enums/Enums';
import { Position } from '../Interfaces/Interfaces';

export class Resource extends WorldObject {
  constructor(
    private _type: ResourceTypes,
    _healthPoints: number,
    _position: Position,
    _team: TeamType = TeamType.Neutral,
    _canMove: boolean = false,
    _isDestroyed: boolean = false,
  ) {
    super(_isDestroyed, _healthPoints, _position, _canMove, _team);
    
  }
}