import { ResourceTypes, TeamType, UnitType } from '../Enums/Enums';
import { engine } from '../Engine/Engine';
import { Position } from './Position';
import { Unit } from './Unit';
import { FightDamage } from '../Interfaces/Interfaces';
import { Resource } from './Resource';

export const convertCoordinatesFromStringToNumber = (
  coordinates: string
): number[] => {
  return coordinates.split(',').map((coordinate) => Number(coordinate));
};

export const selectTeam = (team: string): TeamType => {
  const teamType = team.toUpperCase();

  switch (teamType) {
    case TeamType.Blue:
      return TeamType.Blue;
    case TeamType.Red:
      return TeamType.Red;
    default:
      return TeamType.Neutral;
  }
};

export const validateName = (name: string): string => {
  const doesNameExist = engine.units.some((unit) => unit.name === name);

  if (!doesNameExist && name.length < 20) {
    return '';
  } else if (doesNameExist) {
    return `The name ${name} already exist`;
  } else {
    return `The length should be less than 20 characters`;
  }
};

export const checkPlaceForAvailability = (position: Position): string => {
  const place = engine.resources.some(
    (unit) => unit.position.x === position.x && unit.position.y === position.y
  );

  if (place) {
    return `This place is already taken.`;
  } else {
    return '';
  }
};

export const checkResourceType = (type: string): string => {
  if (
    type.toUpperCase() !== ResourceTypes.Iron &&
    type.toUpperCase() !== ResourceTypes.Lumber &&
    type.toUpperCase() !== ResourceTypes.Food
  ) {
    return `Resource type ${type} does not exist!`;
  } else {
    return '';
  }
};

export const moveGatheredResource = (resourceToMove: Resource) => {
  const resourceIndex = engine.resources.findIndex(
    (resource) =>
      resource.position.x === resourceToMove.position.x &&
      resource.position.y === resourceToMove.position.y
  );

  engine.resources.splice(resourceIndex, 1);
  engine.gatheredResources.push(resourceToMove);
};

export const calculateResourceQuantity = (
  neededResource: string,
  teamOfResource: TeamType
): number => {
  const teamResourceFound = engine.gatheredResources.filter(
    (resource) =>
      resource.type.toLowerCase() === neededResource &&
      resource.team === teamOfResource
  );

  const teamResourceQuantity = teamResourceFound.reduce(
    (prevResource, currResource): number => {
      return prevResource + currResource.healthPoints;
    },
    0
  );

  return teamResourceQuantity;
};

export const validateUnit = (
  name: string,
  position: string,
  team: string
): string => {
  const validNameMessage = validateName(name);
  const validPositionMessage = validatePosition(position);
  const validTeam = validateTeam(team);

  if (validPositionMessage) {
    return validPositionMessage;
  } else if (validTeam) {
    return validTeam;
  } else {
    return validNameMessage;
  }
};

export const validateTeam = (team: string): string => {
  if (!team) {
    return 'Team is not provided!';
  }
  const teamType = team.toUpperCase();
  if (teamType === TeamType.Red) {
    return '';
  } else if (teamType === TeamType.Blue) {
    return '';
  } else {
    return 'Team type is not valid!';
  }
};

export const validateResource = (
  position: Position,
  type: string,
  quantity: number
): string => {
  const availablePlaceMessage = checkPlaceForAvailability(position);
  const validResourceTypeMessage = checkResourceType(type);
  const validQuantityMessage = checkQuantity(quantity);

  if (availablePlaceMessage) {
    return availablePlaceMessage;
  } else if (validResourceTypeMessage) {
    return validResourceTypeMessage;
  } else {
    return validQuantityMessage;
  }
};

export const checkQuantity = (quantity: number) => {
  if (quantity < 1 || isNaN(quantity)) {
    return 'Please provide valid quantity!';
  } else {
    return '';
  }
};

export const createPosition = (coordinates: string): Position => {
  const positionCoordinates = convertCoordinatesFromStringToNumber(coordinates);
  return new Position(positionCoordinates[0], positionCoordinates[1]);
};

export const validatePosition = (coordinates: string) => {
  const convertedCoordinates =
    convertCoordinatesFromStringToNumber(coordinates);
  const areCoordinatesValid = convertedCoordinates.every(
    (coordinate) => !isNaN(coordinate)
  );
  if (
    convertedCoordinates[0] < 0 ||
    convertedCoordinates[1] < 0 ||
    !areCoordinatesValid ||
    convertedCoordinates.length < 2
  ) {
    return `Coordinates are not valid.`;
  } else {
    return '';
  }
};

export const findUnit = (unitName: string): Unit | string => {
  const wantedUnit = engine.units.find(
    (currentUnit) => currentUnit.name === unitName
  );

  if (wantedUnit) {
    return wantedUnit;
  } else {
    return `This user does not exist.`;
  }
};

export const findUnitsAtCoordinates = ({
  position,
  team,
  name,
}: Unit): Unit[] | string => {
  const unitsAtSameCoordinates = engine.units.filter(
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
};

export const chooseRandomUnit = (units: Unit[]): Unit => {
  const attackedUnit = units[Math.floor(Math.random() * units.length)];
  return attackedUnit;
};

export const isHitCritical = (): boolean => {
  return Math.random() * 100 > 49;
};

export const calculateDamage = (attack: number, defence: number): number => {
  return attack - defence;
};

export const resolveOrdinaryFight = (
  attacker: Unit,
  defender: Unit
): FightDamage => {
  const criticalHit = isHitCritical();

  let attackerDamage = calculateDamage(attacker.attack, defender.defence);
  const defenderDamage = calculateDamage(defender.attack, attacker.defence);

  if (criticalHit) {
    attackerDamage *= 2;
    defender.modifyHealthPoints(attackerDamage);
  } else {
    defender.modifyHealthPoints(attackerDamage);
  }
  attacker.modifyHealthPoints(defenderDamage);

  return { attackerDamage, defenderDamage };
};

export const resolveNinjaFight = (
  attacker: Unit,
  defenders: Unit[]
): FightDamage => {
  const criticalHit = isHitCritical();

  const attackerAllDamageApplied = defenders.map((defender) => {
    let damage = calculateDamage(attacker.attack, defender.defence);

    if (criticalHit) {
      defender.modifyHealthPoints(damage * 2);
      return (damage *= 2);
    } else {
      defender.modifyHealthPoints(damage);
      return damage;
    }
  });

  const sumDamage = attackerAllDamageApplied.reduce(
    (damage1, damage2) => damage1 + damage2
  );

  return { attackerDamage: sumDamage, defenderDamage: 0 };
};

export const calculateDeadUnits = (units: Unit[]): number => {
  const deadUnits = units.filter((unit) => unit.isDestroyed);
  return deadUnits.length;
};

export const calculateTeamPoints = (team: Unit[], resources: Resource[]) => {
  const unitsPoints = team.reduce((unit1, unit2): number => {
    switch (unit2.type) {
      case UnitType.Giant:
        return unit1 + 15;
      case UnitType.Ninja:
        return unit1 + 15;
      case UnitType.Peasant:
        return unit1 + 5;
      case UnitType.Guard:
        return unit1 + 10;
      default:
        return unit1 + 0;
    }
  }, 0);

  const resourcesPoints = resources.reduce(
    (resource1, resource2): number => resource1 + resource2.healthPoints * 10,
    0
  );
  return unitsPoints + resourcesPoints;
};
