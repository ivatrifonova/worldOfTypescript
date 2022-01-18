import { TeamType } from '../Enums/Enums';
import { engine } from '../Engine/Engine';
import { Position } from './Position.model';
import { Unit } from './Unit.model';
import { FightDamage } from '../Interfaces/Interfaces';


class Utils {
  convertCoordinatesFromStringToNumber(coordinates: string): number[] {
    return coordinates.split(',').map((coordinate) => Number(coordinate));
  }

  selectTeam(team: string): TeamType{
    const teamType: string = team.toUpperCase();
    switch (teamType) {
      case TeamType.Blue:
        return TeamType.Blue;
      case TeamType.Red:
        return TeamType.Red;
      default: 
      return TeamType.Neutral;

    }
  }
  checkForValidCoordinates(coordinates: number[]): boolean {
    const areCoordinatesValid = coordinates.every(coordinate => !isNaN(coordinate));
    return areCoordinatesValid;
  }


  validateName(name: string): string {
    let doesNameExist = engine.units.some((unit) => unit.name === name);
    if (!doesNameExist && name.length < 20) return '';
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
    if (place) return `This place is already taken.`;
    else return '';
  }

  checkResourceType(type: string): string {
    if (type !== 'iron' && type !== 'lumber' && type !== 'food') {
      return `Resource type ${type} does not exist!`;
    }
    return '';
  }

  validateUnit(name: string, position: string, team: string): string {
    const validNameMessage = utils.validateName(name);
    const validPositionMessage = utils.validatePosition(position);
    const validTeam = utils.validateTeam(team);
    if (validPositionMessage) return validPositionMessage;
    else if(validTeam) return validTeam;
    else return validNameMessage;
  }
   
  validateTeam(team: string): string {
    let teamType = team.toUpperCase();
    if(teamType === TeamType.Red) return "";
    else if(teamType === TeamType.Blue) return '';
    else return "Team type is not valid!";
  }

  validateResource(position: Position, type: string, quantity: number): string {
    const availablePlaceMessage = this.checkPlaceForAvailability(position);
    const validResourceTypeMessage = this.checkResourceType(type);
    const validQuantityMessage = this.checkQuantity(quantity);

    if (availablePlaceMessage) return availablePlaceMessage;
    else if (validResourceTypeMessage) return validResourceTypeMessage;
    else return validQuantityMessage;
  }

  checkQuantity(quantity: number) {
    if (quantity < 1) {
      return 'Please provide valid quantity!';
    }
    return '';
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
    return '';
  }

  findUnit(unitName: string): Unit {
    let wantedUnit = engine.units.find(
      (currentUnit) => currentUnit.name === unitName
    );
    if (wantedUnit) return wantedUnit;
    else throw new Error(`This user does not exist.`);
  }

  findUnitsAtCoordinates({ position, team, name }: Unit): Unit[] | string {
    let unitsAtSameCoordinates = engine.units.filter(
      (unit) =>
        unit.position.x === position.x &&
        unit.position.y === position.y &&
        unit.team !== team &&
        unit.isDestroyed === false &&
        unit.name !== name
    );

    if (unitsAtSameCoordinates.length > 0) {
      return unitsAtSameCoordinates;
    } else {
      return `There are no units to attack at these coordinates.`;
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

  resolveOrdinaryFight(attacker: Unit, defender: Unit): FightDamage {
    let criticalHit = utils.isHitCritical();

    let attackerDamage = utils.calculateDamage(
      attacker.attack,
      defender.defence
    );
    let defenderDamage = utils.calculateDamage(
      defender.attack,
      attacker.defence
    );

    if (criticalHit) {
      defender.modifyHealthPoints(-attackerDamage * 2);
      attackerDamage *= 2;
    } else {
      defender.modifyHealthPoints(-attackerDamage);
    }
    attacker.modifyHealthPoints(-defenderDamage);

    return { attackerDamage, defenderDamage };
  }

  resolveNinjaFight(attacker: Unit, defenders: Unit[]): FightDamage {
    let criticalHit = utils.isHitCritical();

    const attackerAllDamageApplied = defenders.map((defender) => {
      let damage = utils.calculateDamage(attacker.attack, defender.defence);

      if (criticalHit) {
        defender.modifyHealthPoints(-damage * 2);
        return (damage *= 2);
      } else {
        defender.modifyHealthPoints(-damage);
        return damage;
      }
    });

    const sumDamage = attackerAllDamageApplied.reduce(
      (damage1, damage2) => damage1 + damage2
    );

    return { attackerDamage: sumDamage, defenderDamage: 0 };
  }

  clearBattlefield(units: Unit[]): number {
    let deadUnits = units.filter((unit) => {
      if (unit.healthPoints <= 0) {
        unit.isDestroyed = true;
        return true;
      }
      return false;
    });
    return deadUnits.length;
  }
}

let utils = new Utils();

export default utils;
