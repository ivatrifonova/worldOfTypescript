import WorldObject from './worldObject.model';
import { ResourceTypes, TeamType } from '../Enums/Enums';
import { Position } from '../Interfaces/Interfaces';

export class Resource extends WorldObject {
  constructor(
    private _quantity: number,
    private _type: ResourceTypes,
    _isDestroyed: boolean,
    _healthPoints: number,
    _position: Position,
    _canMove: boolean,
    _team: TeamType
  ) {
    super(_isDestroyed, _healthPoints, _position, _canMove, _team);
  }
}