import { Position as PositionInterface } from '../Interfaces/Interfaces';

export class Position implements PositionInterface {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
