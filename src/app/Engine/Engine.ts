import { Unit } from "../Models/Unit.model";
import { Resource } from "../Models/Resource.model";
import { UnitType, TeamType } from "../Enums/Enums";
import utils from "../Models/Utils.model";
import { Position } from "../Models/Position.model";
import {Team} from "../Models/Team.model"; 

class Engine {
    private _redTeam: Team;
    private _blueTeam: Team;
    constructor() {
        this._redTeam = new Team(TeamType.Red);
        this._blueTeam = new Team(TeamType.Blue);
    }

    createUnit(name: string, type: string, position: string, team: string): string {
        try {
            let newUnit: Unit;
            const unitType = type.toLowerCase();
            const positionCoordinates = utils.convertCoordinatesFromStringToNumber(position);
            const unitPosition = new Position(positionCoordinates[0], positionCoordinates[1]);
            const neededStringForTeam = utils.selectTeam(team);
            switch (unitType) {
                case "peasant": 
                    newUnit = new Unit(name, 25, 10, true, UnitType.Peasant, false, 50, unitPosition, true, neededStringForTeam);
                    console.log(newUnit)
                break;
                case "guard": 
                    newUnit = new Unit(name, 30, 20, false, UnitType.Guard, false, 80, unitPosition, true, neededStringForTeam);
                break;
                case "ninja": 
                    newUnit = new Unit(name, 50, 10, false, UnitType.Ninja, false, 80, unitPosition, true, neededStringForTeam);
                break;
                case "giant":
                    newUnit = new Unit(name, 40, 20, true, UnitType.Giant, false, 90, unitPosition, true, neededStringForTeam);
                break;
            }
        } catch(error) {
            return `Error: ${error}`;
        }
        return `Created ${type} from ${team} team named ${name} at position ${position}`;
    }

    createResource(): void {

    }

    showParameters() {

    }

    showAll() {

    }

    showUnits() {

    }

    showResources() {

    }

    findCoordinates() {
        
    }
}

export const engine = new Engine();