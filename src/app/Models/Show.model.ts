import { engine } from '../Engine/Engine';
import { Unit } from './Unit.model';

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

showCoordinates(coordinates: string): void {
    const presenceAtLocation = engine.units.filter(unit => Object.values(unit.position).toString() === coordinates)
    || engine.resources.find(resource => Object.values(resource.position).toString() === coordinates) 
    || `Coordinates: ${coordinates} are empty!`;
    
    console.log(presenceAtLocation);
}

showAll(): string {
    const allUnits = engine.units.map(unit => [unit.name, unit.type]);
    const allResources = engine.resources.map(resource => [resource.type, resource.healthPoints]);
    const message = `The game field comprises of ${allUnits.length} units: ${allUnits.join("; ")} \n 
    and ${allResources.length} resources: ${allResources}`;

    return allUnits.length > 0 || allResources.length > 0 ? message : 'There are NEITHER units NOR resources on the field!';
}

showResults() {
    // const blueTeamPoints: number = engine.resources.reduce((prevResource, currResource) => prevResource.healthPoints + currResource)

    // return blueTeamPoints;
}

}

const show = new Show();

export default show;