import { TeamType } from '../Enums/Enums';
import { engine } from '../Engine/Engine';
import { Position } from './Position.model';

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

  validateName(name: string): string | Error {
    let doesNameExist = engine.units.some((unit) => unit.name === name);
    if (!doesNameExist && name.length < 20) return name;
    else if (doesNameExist) {
      throw new Error(`The name ${name} already exist`);
    } else {
      throw new Error(`The length should be less than 20 characters`);
    }
  }
  
  checkPlaceForAvailability(position: Position) {
  let place = engine.units.some(unit => unit.position.x === position.x && unit.position.y === position.y)
  if(place) {
    throw new Error(`This place is already taken.`)
  } else {
    return place;
  }
  }

  checkResourceType(type: string): void {
    if(type !== "iron" && type !== "lumber" && type !== "food") {
    throw new Error(`Resource type ${type} does not exist!`)
    }
  }

  checkQuantity(quantity: number) {
    if(quantity < 1) {
      throw new Error("Please provide valid quantity!")
    }
  }
}

let utils = new Utils();

export default utils;
