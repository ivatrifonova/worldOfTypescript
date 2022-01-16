import { Unit } from "../Models/Unit.model";
import { Resource } from "../Models/Resource.model";
import { UnitType, TeamType, ResourceTypes } from "../Enums/Enums";
import utils from "../Models/Utils.model";
import { Position } from "../Models/Position.model";
import {Team} from "../Models/Team.model"; 
import show from "../Models/Show.model"


class Engine {
    private _units: Unit[];
    private _resources: Resource[];
    constructor() {
        this._units = [];
        this._resources = [];
    }

    get units (): Unit[] {
        return this._units;
    }
    
    get resources (): Resource[] {
        return this._resources;
    }

    createUnit(name: string, type: string, position: string, team: string): string {
        try {
            let newUnit: Unit;
            const unitType = type.toLowerCase();
            const positionCoordinates = utils.convertCoordinatesFromStringToNumber(position);
            const unitPosition = new Position(positionCoordinates[0], positionCoordinates[1]);
            const neededStringForTeam = utils.selectTeam(team);
            const nameCheck = utils.validateName(name);
            
            switch (unitType) {
                case "peasant": 
                    newUnit = new Unit(name, 25, 10, true, UnitType.Peasant, false, 50, unitPosition, true, neededStringForTeam);
                    this._units.push(newUnit);
                break;
                case "guard": 
                    newUnit = new Unit(name, 30, 20, false, UnitType.Guard, false, 80, unitPosition, true, neededStringForTeam);
                    this._units.push(newUnit);
                break;
                case "ninja": 
                    newUnit = new Unit(name, 50, 10, false, UnitType.Ninja, false, 80, unitPosition, true, neededStringForTeam);
                    this._units.push(newUnit);
                break;
                case "giant":
                    newUnit = new Unit(name, 40, 20, true, UnitType.Giant, false, 90, unitPosition, true, neededStringForTeam);
                    this._units.push(newUnit);
                break;
                default: 
                throw new Error(`Unit type ${type} does not exist!`)
                    
            }
        } catch(error) {
            return `Error: ${error}`;
        }
        return `Created ${type} from ${team} team named ${name} at position ${position}`;
    }
    
    createResource(quantity: number, type: string, position: string): string {
        try{
            let newResource: Resource;
            let resourceType = type.toLowerCase();
            let positionCoordinates = utils.convertCoordinatesFromStringToNumber(position);
            const resourcePosition = new Position(positionCoordinates[0], positionCoordinates[1])
            const isPlaceAvailable = utils.checkPlaceForAvailability(resourcePosition);
            const checkResourceType = utils.checkResourceType(resourceType);
            const checkQuantity = utils.checkQuantity(quantity);

            switch(resourceType) {
                case "food": 
                    newResource = new Resource(quantity, ResourceTypes.Food, false, quantity, resourcePosition, false, TeamType.Neutral)
                    this._resources.push(newResource);
                break;
                case "lumber": 
                    newResource = new Resource(quantity, ResourceTypes.Lumber, false, quantity, resourcePosition, false, TeamType.Neutral)
                    this._resources.push(newResource);
                    console.log(newResource);
                    break;
                case "iron": 
                    newResource = new Resource(quantity, ResourceTypes.Iron, false, quantity, resourcePosition, false, TeamType.Neutral)
                    this._resources.push(newResource);
                    break;
                default: 
                    throw new Error(`Resource type ${type} does not exist!`)
            }  
        }catch(error) {
            return `Error: ${error}`;
        }
        return `‘Created ${type} at position ${position} with ${quantity} health’`;
        

    }

    show(type: string) {
    switch(type) {
        case "all": 
        show.showAll()
        break;
        case "units": 
        show.showUnits();
        break;
        case "resources": 
        show.showResources();
        break;
        case "coordinates":
        show.showCoordinates();
    } 
    }
}

export const engine = new Engine();