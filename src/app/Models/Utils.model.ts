import { TeamType, UnitType } from '../Enums/Enums';
import { engine } from '../Engine/Engine';
import { Position } from './Position.model';
import { Unit } from './Unit.model';
import { FightDamage } from '../Interfaces/Interfaces';
import { Resource } from './Resource.model';


class Utils {
  public convertCoordinatesFromStringToNumber(coordinates: string): number[] {
    return coordinates.split(',').map((coordinate) => Number(coordinate));
  }

  public selectTeam(team: string): TeamType{
    const teamType = team.toUpperCase();
    switch (teamType) {
      case TeamType.Blue:
        return TeamType.Blue;
      case TeamType.Red:
        return TeamType.Red;
      default: 
      return TeamType.Neutral;
    }
  }

  public checkForValidCoordinates(coordinates: number[]): boolean {
    const areCoordinatesValid = coordinates.every(coordinate => !isNaN(coordinate));
    return areCoordinatesValid;
  }


  public validateName(name: string): string {
    let doesNameExist = engine.units.some((unit) => unit.name === name);

    if (!doesNameExist && name.length < 20) return '';
    else if (doesNameExist) {
      return `The name ${name} already exist`;
    } else {
      return `The length should be less than 20 characters`;
    }
  }

  public checkPlaceForAvailability(position: Position): string {
    let place = engine.resources.some(
      (unit) => unit.position.x === position.x && unit.position.y === position.y
    );
    if (place) return `This place is already taken.`;
    else return '';
  }

  public checkResourceType(type: string): string {
    if (type.toLowerCase() !== 'iron' && type.toLowerCase() !== 'lumber' && type.toLowerCase() !== 'food') {
      return `Resource type ${type} does not exist!`;
    }
    return '';
  }

  public moveGatheredResource(resourceToMove: Resource) {
    const resourceIndex = engine.resources.findIndex(resource => resource.position.x === resourceToMove.position.x 
      && resource.position.y === resourceToMove.position.y);
    engine.resources.splice(resourceIndex, 1);
    engine.gatheredResources.push(resourceToMove);
  }

  public calculateResourceQuantity(neededResource: string, teamOfResource: TeamType): number {
    const teamResourceFound = engine.gatheredResources.filter(resource => resource.type.toLowerCase() === neededResource
    && resource.team === teamOfResource);
    const teamResourceQuantity = teamResourceFound.reduce((prevResource, currResource): number => {
      return prevResource + currResource.healthPoints
    }, 0)

    return teamResourceQuantity;
  }

  public validateUnit(name: string, position: string, team: string): string {
    const validNameMessage = utils.validateName(name);
    const validPositionMessage = utils.validatePosition(position);
    const validTeam = utils.validateTeam(team);
    
    if (validPositionMessage) return validPositionMessage;
    else if(validTeam) return validTeam;
    else return validNameMessage;
  }
   
  public validateTeam(team: string): string {
    let teamType = team.toUpperCase();
    if(teamType === TeamType.Red) return "";
    else if(teamType === TeamType.Blue) return '';
    else return "Team type is not valid!";
  }

  public validateResource(position: Position, type: string, quantity: number): string {
    const availablePlaceMessage = this.checkPlaceForAvailability(position);
    const validResourceTypeMessage = this.checkResourceType(type);
    const validQuantityMessage = this.checkQuantity(quantity);

    if (availablePlaceMessage) return availablePlaceMessage;
    else if (validResourceTypeMessage) return validResourceTypeMessage;
    else return validQuantityMessage;
  }

  public checkQuantity(quantity: number) {
    if (quantity < 1) {
      return 'Please provide valid quantity!';
    }
    return '';
  }

  public createPosition(coordinates: string): Position {
    const positionCoordinates = utils.convertCoordinatesFromStringToNumber(coordinates);
    return new Position(positionCoordinates[0], positionCoordinates[1]);
  }

  public validatePosition(coordinates: string) {
    const convertedCoordinates = utils.convertCoordinatesFromStringToNumber(coordinates);
    if (convertedCoordinates[0] < 0 || convertedCoordinates[1] < 0) {
      return `Coordinates are not valid.`;
    }
    return '';
  }

  public findUnit(unitName: string): Unit | string {
    let wantedUnit = engine.units.find((currentUnit) => currentUnit.name === unitName);
    if (wantedUnit) return wantedUnit;
    else return `This user does not exist.`;
  }

  public findUnitsAtCoordinates({ position, team, name }: Unit): Unit[] | string {
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

  public chooseRandomUnit(units: Unit[]): Unit {
    const attackedUnit = units[Math.floor(Math.random() * units.length)];
    return attackedUnit;
  }

  public isHitCritical(): boolean {
    return Math.random() * 100 > 49;
  }

  public calculateDamage(attack: number, defence: number): number {
    return attack - defence;
  }

  public resolveOrdinaryFight(attacker: Unit, defender: Unit): FightDamage {
    let criticalHit = utils.isHitCritical();

    let attackerDamage = utils.calculateDamage(attacker.attack,defender.defence);
    let defenderDamage = utils.calculateDamage(defender.attack,attacker.defence);

    if (criticalHit) {
      defender.modifyHealthPoints(-attackerDamage * 2);
      attackerDamage *= 2;
    } else {
      defender.modifyHealthPoints(-attackerDamage);
    }
    attacker.modifyHealthPoints(-defenderDamage);

    return { attackerDamage, defenderDamage };
  }

  public resolveNinjaFight(attacker: Unit, defenders: Unit[]): FightDamage {
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

  public clearBattlefield(units: Unit[]): number {
    let deadUnits = units.filter((unit) => {
      if (unit.healthPoints <= 0) {
        unit.isDestroyed = true;
        return true;
      }
      return false;
    });
    return deadUnits.length;
  }

  public calculateTeamPoints(team: Unit[],resources: Resource[]) {

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
