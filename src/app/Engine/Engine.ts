import { Unit } from '../Models/Unit.model';
import { Resource } from '../Models/Resource.model';
import { UnitType, ResourceTypes } from '../Enums/Enums';
import utils from '../Models/Utils.model';
import show from '../Models/Show.model';

class Engine {
  private _units: Unit[];
  private _resources: Resource[];
  private _gatheredResources: Resource[];
  constructor() {
    this._units = [];
    this._resources = [];
    this._gatheredResources = [];
  }

  public get units(): Unit[] {
    return this._units;
  }

  public get resources(): Resource[] {
    return this._resources;
  }

  public get gatheredResources(): Resource[] {
    return this._gatheredResources;
  }

  public set gatheredResources(resources) {
    this._gatheredResources = resources;
  }

  public createUnit([, , name, position, team, type]: string[]): string {
    let newUnit: Unit;
    const unitType = type.toLowerCase();
    const unitPosition = utils.createPosition(position);
    const teamType = utils.selectTeam(team);

    const validPositionMessage = utils.validatePosition(position);
    const validNameMessage = utils.validateName(name);

    if (validPositionMessage || validNameMessage) {
      return validNameMessage ? validNameMessage : validPositionMessage;
    }
    switch (unitType) {
      case 'peasant':
        newUnit = new Unit(
          name,
          25,
          10,
          UnitType.Peasant,
          50,
          unitPosition,
          teamType
        );
        break;
      case 'guard':
        newUnit = new Unit(
          name,
          30,
          20,
          UnitType.Guard,
          80,
          unitPosition,
          teamType,
          false
        );
        break;
      case 'ninja':
        newUnit = new Unit(
          name,
          50,
          10,
          UnitType.Ninja,
          80,
          unitPosition,
          teamType,
          false
        );
        break;
      case 'giant':
        newUnit = new Unit(
          name,
          40,
          20,
          UnitType.Giant,
          90,
          unitPosition,
          teamType,
          true
        );
        break;
      default:
        return `Unit type ${type} does not exist!`;
    }
    this._units.push(newUnit);
    return `Created ${type} from ${team} team named ${name} at position ${position}`;
  }

  public createResource([, , type, position, quantity]: string[]): string {
    let newResource: Resource;
    const resourceType = type.toLowerCase();
    const convertedQuantity = Number(quantity);
    const resourcePosition = utils.createPosition(position);

    const availablePlaceMessage = utils.checkPlaceForAvailability(resourcePosition);
    const validResourceTypeMessage = utils.checkResourceType(resourceType);
    const validQualityMessage = utils.checkQuantity(convertedQuantity);

    if(availablePlaceMessage || validResourceTypeMessage || validQualityMessage ) {
      if(availablePlaceMessage) return availablePlaceMessage;
      else if (validResourceTypeMessage) return validResourceTypeMessage;
      else return validQualityMessage;
    }
    
    switch (resourceType) {
      case 'food':
        newResource = new Resource(
          ResourceTypes.Food,
          convertedQuantity,
          resourcePosition
        );
        break;
      case 'lumber':
        newResource = new Resource(
          ResourceTypes.Lumber,
          convertedQuantity,
          resourcePosition
        );
        break;
      case 'iron':
        newResource = new Resource(
          ResourceTypes.Iron,
          convertedQuantity,
          resourcePosition
        );
        break;
      default:
        return `Resource type ${type} does not exist!`;
    }
    this._resources.push(newResource);
    return `Created ${type} at position ${position} with ${quantity} health`;
  }

  public show([, type, team]: string[]): string {
    switch (type) {
      case 'all':
        return show.showAll();
      case 'units':
        return show.showUnits(team);
      case 'resources':
        return show.showResources();
      case 'coordinates':
        return show.showCoordinates(team);
      default:
        return `Invalid command. Available options: all, units, resources, coordinates`;
    }
  }

  public order([, currentUnit, type, coordinates]: string[]): string {
    const unit = utils.findUnit(currentUnit);
    switch (type) {
      case 'attack':
        return unit.type === "ninja" ? unit.ninjaAttack() : unit.ordinaryAttack();
      case 'gather': {
        return unit.gather();
      }
      case `go`:
        const numberedCoordinates = utils.convertCoordinatesFromStringToNumber(coordinates);
        return utils.checkForValidCoordinates(numberedCoordinates) ? unit.go(coordinates) : 'Please enter valid coordinates!';
      default: 
      return `The order is invalid!`; 
    }
  }
  public create(commands: string[]): string {
    return commands[1] === 'unit'
      ? this.createUnit(commands)
      : this.createResource(commands);
  }

}

export const engine = new Engine();
