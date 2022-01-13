import WorldObject from './worldObject.model';
import { UnitType, Team } from '../Enums/Enums';
import { Position } from '../Interfaces/Position.interface';

class Unit extends WorldObject {
  constructor(
    private _name: string,
    private _attack: number,
    private _defence: number,
    private _canGather: boolean,
    private _type: UnitType,
    _isDestroyed: boolean,
    _healthPoints: number,
    _position: Position,
    _canMove: boolean,
    _team: Team
  ) {
    super(_isDestroyed, _healthPoints, _position, _canMove, _team);
  }
}
