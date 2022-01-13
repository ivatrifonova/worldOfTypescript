import { Position } from '../Interfaces/Position.interface';

export default abstract class WorldObject {
  constructor(
    private _isDestroyed: boolean,
    private _healthPoints: number,
    private _position: Position,
    private _canMove: boolean,
    private _team: string
  ) {}
}
