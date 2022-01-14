import { Position } from '../Interfaces/Interfaces';
import { TeamType } from '../Enums/Enums';

export default abstract class WorldObject {
  constructor(
    private _isDestroyed: boolean,
    private _healthPoints: number,
    private _position: Position,
    private _canMove: boolean = true,
    private _team: TeamType = TeamType.Neutral
  ) {}
}
