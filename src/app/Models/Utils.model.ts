import { TeamType, UnitType } from '../Enums/Enums';
import { engine } from '../Engine/Engine';
import { Position } from './Position.model';
import { Unit } from './Unit.model';
import { FightDamage } from '../Interfaces/Interfaces';
import { Resource } from './Resource.model';


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
    let doesNameExist:boolean = engine.units.some((unit) => unit.name === name);

    if (!doesNameExist && name.length < 20) return '';
    else if (doesNameExist) {
      return `The name ${name} already exist`;
    } else {
      return `The length should be less than 20 characters`;
    }
  }

  checkPlaceForAvailability(position: Position): string {
    let place:boolean = engine.resources.some(
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
    const validNameMessage:string = utils.validateName(name);
    const validPositionMessage:string = utils.validatePosition(position);
    const validTeam:string = utils.validateTeam(team);
    
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
    const availablePlaceMessage:string = this.checkPlaceForAvailability(position);
    const validResourceTypeMessage:string = this.checkResourceType(type);
    const validQuantityMessage:string = this.checkQuantity(quantity);

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
    const positionCoordinates:number[] = utils.convertCoordinatesFromStringToNumber(coordinates);
    return new Position(positionCoordinates[0], positionCoordinates[1]);
  }

  validatePosition(coordinates: string) {
    const convertedCoordinates:number[] = utils.convertCoordinatesFromStringToNumber(coordinates);
    if (convertedCoordinates[0] < 0 || convertedCoordinates[1] < 0) {
      return `Coordinates are not valid.`;
    }
    return '';
  }

  findUnit(unitName: string): Unit {
    let wantedUnit:Unit | undefined = engine.units.find((currentUnit) => currentUnit.name === unitName);
    if (wantedUnit) return wantedUnit;
    else throw new Error(`This user does not exist.`);
  }

  findUnitsAtCoordinates({ position, team, name }: Unit): Unit[] | string {
    let unitsAtSameCoordinates:Unit[] = engine.units.filter(
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
    const attackedUnit:Unit = units[Math.floor(Math.random() * units.length)];
    return attackedUnit;
  }

  isHitCritical(): boolean {
    return Math.random() * 100 > 49;
  }

  calculateDamage(attack: number, defence: number): number {
    return attack - defence;
  }

  resolveOrdinaryFight(attacker: Unit, defender: Unit): FightDamage {
    let criticalHit:boolean = utils.isHitCritical();

    let attackerDamage:number = utils.calculateDamage(attacker.attack,defender.defence);
    let defenderDamage:number = utils.calculateDamage(defender.attack,attacker.defence);

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
    let criticalHit:boolean = utils.isHitCritical();

    const attackerAllDamageApplied:number[] = defenders.map((defender) => {
      let damage:number = utils.calculateDamage(attacker.attack, defender.defence);

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
    let deadUnits:Unit[] = units.filter((unit) => {
      if (unit.healthPoints <= 0) {
        unit.isDestroyed = true;
        return true;
      }
      return false;
    });
    return deadUnits.length;
  }

  calculateTeamPoints(team: Unit[],resources: Resource[]) {

    const unitsPoints = team.reduce((unit1, unit2): number => {
    if(unit2.type === UnitType.Giant) {
     return unit1 + 15;
    } else if(unit2.type === UnitType.Ninja) {
      return unit1 + 15;
    } else if(unit2.type === UnitType.Peasant) {
      return unit1 + 5;
    } else {
      return unit1 + 10;
    }
    }, 0)
  
    const resourcesPoints = resources.reduce((resource1, resource2):number => (resource1 + resource2.healthPoints * 10),0)
    return unitsPoints + resourcesPoints;
  }
}

let utils = new Utils();

export default utils;
