import { TeamType } from '../Enums/Enums';
import { engine } from '../Engine/Engine';
import { Position } from './Position.model';
import { Unit } from './Unit.model';
import { unsupported } from '@angular/compiler/src/render3/view/util';

class Utils {
  convertCoordinatesFromStringToNumber(coordinates: string): number[] {
    return coordinates.split(',').map((coordinate) => Number(coordinate));
  }

  selectTeam(team: string): TeamType {
    if (team.toUpperCase() === TeamType.Blue) {
      return TeamType.Blue;
    } else if (team.toUpperCase() === TeamType.Red) {
      return TeamType.Red;
    } else {
      throw new Error(`Team ${team} does not exist!`);
    }
  }

  validateName(name: string): string {
    let doesNameExist = engine.units.some((unit) => unit.name === name);
    if (!doesNameExist && name.length < 20) return "";
    else if (doesNameExist) {
      return `The name ${name} already exist`;
    } else {
      return `The length should be less than 20 characters`;
    }
  }

  checkPlaceForAvailability(position: Position): string {
    let place = engine.resources.some(
      (unit) => unit.position.x === position.x && unit.position.y === position.y
    );
    if (place) return`This place is already taken.`;
    else return "";
  }

  checkResourceType(type: string): string {
    if (type !== 'iron' && type !== 'lumber' && type !== 'food') {
     return `Resource type ${type} does not exist!`;
    }
    return "";
  }

  checkQuantity(quantity: number) {
    if (quantity < 1) {
      return 'Please provide valid quantity!';
    }
    return "";
  }

  createPosition(coordinates: string): Position {
    const positionCoordinates =
      utils.convertCoordinatesFromStringToNumber(coordinates);
    return new Position(positionCoordinates[0], positionCoordinates[1]);
  }

  validatePosition(coordinates: string) {
    const convertedCoordinates =
      utils.convertCoordinatesFromStringToNumber(coordinates);
    if (convertedCoordinates[0] < 0 || convertedCoordinates[1] < 0) {
      return `Coordinates are not valid.`;
    }
    return "";
  }

  findUnit(unitName: string): Unit {
    let wantedUnit = engine.units.find(
      (currentUnit) => currentUnit.name === unitName
    );
    if (wantedUnit) return wantedUnit;
    else throw new Error(`This user does not exist.`);
  }
  findUnitsAtCoordinates(position: Position, team: TeamType, name: string): Unit[] | string {
    let unitsAtSameCoordinates = engine.units.filter(
      (unit) => unit.position.x === position.x && unit.position.y === position.y && unit.team !== team && unit.isDestroyed === false && unit.name !== name
    );
    if (unitsAtSameCoordinates.length > 0) {
    return unitsAtSameCoordinates;
    }  else {
      return `There are no units to attack at these coordinates.`
    }
  }

  chooseRandomUnit(units: Unit[]): Unit {
    const attackedUnit = units[Math.floor(Math.random() * units.length)];
    return attackedUnit;
  }

  isHitCritical(): boolean {
    return Math.random() * 100 > 49;
  }

  calculateDamage(attack: number, defence: number): number {
    return attack - defence;
  }
 }

let utils = new Utils();

export default utils;
