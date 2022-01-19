import { engine } from '../Engine/Engine';
import { TeamType } from '../Enums/Enums';
import { validatePosition, calculateTeamPoints, validateTeam } from './Utils';

export const showUnits = (team: string): string => {
  let validTeam = validateTeam(team);
  if (validTeam) {
    return validTeam;
  }
  const teamUnits = engine.units.filter(
    (unit) => team.toLowerCase() === unit.team.toLowerCase()
  );
  const neededTeamUnits = teamUnits
    .map(
      (unit) =>
        `unit ${unit.name} at position ${Object.values(
          unit.position
        ).toString()}`
    )
    .join('; ');
  const message = `Team ${team} units are: ${neededTeamUnits}`;

  return teamUnits.length > 0 ? message : `Team ${team} has NO units!`;
};

export const showResources = (): string => {
  const allResourcesMessage = engine.resources
    .map(
      (resource) =>
        `Resource ${resource.type.toLowerCase()} with amount of ${
          resource.healthPoints
        } at location ${Object.values(resource.position).toString()}`
    )
    .join('; ');
  return engine.resources.length > 0
    ? allResourcesMessage
    : `There are NO resources in the game!`;
};

export const showCoordinates = (coordinates: string): string => {
  const validCoordinates = validatePosition(coordinates);
  if (validCoordinates) {
    return validCoordinates;
  }

  const unitAtLocation = engine.units.filter(
    (unit) => Object.values(unit.position).toString() === coordinates
  );
  const resourceAtLocation = engine.resources.filter(
    (resource) => Object.values(resource.position).toString() === coordinates
  );
  let message: string;
  debugger;
  if (unitAtLocation.length > 0 || resourceAtLocation.length > 0) {
    let unitMessage = unitAtLocation
      .map(
        (unit) =>
          `Unit ${
            unit.name
          } of type ${unit.type.toLowerCase()} on team ${unit.team.toLowerCase()}. `
      )
      .join(' ');
    let resourceMessage = resourceAtLocation
      .map(
        (resource) =>
          `Resource ${resource.type.toLowerCase()} with health ${
            resource.healthPoints
          }.`
      )
      .join(' ');
    message = unitMessage + resourceMessage;
  } else {
    message = `Coordinates: ${coordinates} are empty!`;
  }

  return message;
};

export const showAll = (): string => {
  const allUnits = engine.units.map((unit) =>
    [unit.name, unit.type.toLowerCase()].join(': ')
  );
  const allResources = engine.resources.map((resource) =>
    [resource.type.toLowerCase(), resource.healthPoints].join(': ')
  );
  const message = `The game field comprises of ${
    allUnits.length
  }. units: ${allUnits.join('; ')}
    ${allResources.length} resources: ${allResources.join('; ')}`;

  return allUnits.length > 0 || allResources.length > 0
    ? message
    : 'There are NEITHER units NOR resources on the field!';
};

export const showResults = () => {
  const blueTeamUnits = engine.units.filter(
    (unit) => unit.team === TeamType.Blue && !unit.isDestroyed
  );
  const redTeamUnits = engine.units.filter(
    (unit) => unit.team === TeamType.Red && !unit.isDestroyed
  );

  const redResources = engine.gatheredResources.filter(
    (resource) => resource.team === TeamType.Red
  );
  const blueResources = engine.gatheredResources.filter(
    (resource) => resource.team === TeamType.Blue
  );

  const redPoints = calculateTeamPoints(redTeamUnits, redResources);
  const bluePoints = calculateTeamPoints(blueTeamUnits, blueResources);

  return `The game is over. Team  ${
    redPoints > bluePoints ? 'Red' : 'Blue'
  } is the winner with ${redPoints > bluePoints ? redPoints : bluePoints}
   and team ${redPoints < bluePoints ? 'Red' : 'Blue'} is the loser with ${
    redPoints < bluePoints ? redPoints : bluePoints
  }.`;
};
