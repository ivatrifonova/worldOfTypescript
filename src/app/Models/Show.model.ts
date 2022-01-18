import { engine } from '../Engine/Engine';
import { TeamType } from '../Enums/Enums';
import { Unit } from './Unit.model';
import utils from './Utils.model';

class Show {

showUnits(team: string): string {
    const teamUnits: Unit[] = engine.units.filter(unit => team.toLowerCase() === unit.team.toLowerCase());
    const neededTeamUnits = teamUnits.map(unit => `unit ${unit.name} at position ${Object.values(unit.position).toString()}`).join("; ");
    const message = `Team ${team} units are: ${neededTeamUnits}`;
    
    return teamUnits.length > 0 ? message : `Team ${team} has NO units!`;
}

showResources(): string {
    const allResourcesMessage = engine.resources.map(resource => 
        `Resource ${resource.type} with amount of ${resource.healthPoints} at location ${Object.values(resource.position).toString()}`).join("; ");
    return engine.resources.length > 0 ? allResourcesMessage : `There are NO resources in the game!`;
}

showCoordinates(coordinates: string):string{
    const presenceAtLocation = engine.units.filter(unit => Object.values(unit.position).toString() === coordinates);
    let unitMessage:string;
    debugger;
    if(presenceAtLocation.length > 0) {
        debugger;
        unitMessage = presenceAtLocation.map(unit => `Unit ${unit.name} of type ${unit.type} on team ${unit.team}`).join("; ")
    } else {
        unitMessage =  `Coordinates: ${coordinates} are empty!`;
    }
    
    return unitMessage;
}

showAll(): string {
    const allUnits = engine.units.map(unit => [unit.name, unit.type]);
    const allResources = engine.resources.map(resource => [resource.type, resource.healthPoints]);
    const message = `The game field comprises of ${allUnits.length} units: ${allUnits.join("; ")} \n 
    and ${allResources.length} resources: ${allResources}`;

    return allUnits.length > 0 || allResources.length > 0 ? message : 'There are NEITHER units NOR resources on the field!';
}

showResults() {
   const blueTeamUnits = engine.units.filter(unit => unit.team === TeamType.Blue && !unit.isDestroyed);
   const redTeamUnits = engine.units.filter(unit => unit.team === TeamType.Red && !unit.isDestroyed);

   const redResources = engine.gatheredResources.filter(resource => resource.team === TeamType.Red);
   const blueResources = engine.gatheredResources.filter(resource => resource.team === TeamType.Blue);

   const redPoints = utils.calculateTeamPoints(redTeamUnits, redResources);
   const bluePoints = utils.calculateTeamPoints(blueTeamUnits, blueResources);

   return `The game is over. Team  ${redPoints > bluePoints? "Red" : "Blue"} is the winner with ${redPoints > bluePoints? redPoints : bluePoints}
   and team ${redPoints < bluePoints? "Red" : "Blue"} is the loser with ${redPoints < bluePoints? redPoints : bluePoints}.`
}

}

const show = new Show();

export default show;