import { Unit } from '../Models/Unit.model';
import { Resource } from '../Models/Resource.model';
import { UnitType, ResourceTypes } from '../Enums/Enums';
import utils from '../Models/Utils.model';

import show from '../Models/Show.model';
import { create } from 'domain';

class Engine {
  private _units: Unit[];
  private _resources: Resource[];
  constructor() {
    this._units = [];
    this._resources = [];
  }

  public get units(): Unit[] {
    return this._units;
  }

  public get resources(): Resource[] {
    return this._resources;
  }

  public createUnit([, , name, position, team, type]: string[]): void {
    let newUnit: Unit;
    const unitType = type.toLowerCase();
    const unitPosition = utils.createPosition(position);
    const teamType = utils.selectTeam(team);

    utils.validatePosition(position);
    utils.validateName(name);
    

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
        throw new Error(`Unit type ${type} does not exist!`);
    }
    this._units.push(newUnit);
    console.log(
      `Created ${type} from ${team} team named ${name} at position ${position}`
    );
  }

  public createResource([, , type, position, quantity]: string[]): void {
    let newResource: Resource;
    const resourceType = type.toLowerCase();
    const convertedQuantity = Number(quantity);
    const resourcePosition = utils.createPosition(position);

    utils.checkPlaceForAvailability(resourcePosition);
    utils.checkResourceType(resourceType);
    utils.checkQuantity(convertedQuantity);

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
        throw new Error(`Resource type ${type} does not exist!`);
    }
    this._resources.push(newResource);
    console.log(
      `Created ${type} at position ${position} with ${quantity} health`
    );
  }

  public show([, type, team]: string[]): void {
    switch (type) {
      case 'all':
        show.showAll();
        break;
      case 'units':
        show.showUnits(team);
        break;
      case 'resources':
        show.showResources();
        break;
      case 'coordinates':
        show.showCoordinates();
    }
  }

  public order([, currentUnit, type]: string[]): void {
    const unit = utils.findUnit(currentUnit);

    switch (type) {
      case 'attack':
        unit.attack();
        break;
      case 'gather': {
        unit.gather();
        break;
      }
    }
  }
  public create(commands: string[]): void {
    commands[1] === 'unit'
      ? this.createUnit(commands)
      : this.createResource(commands);
  }
}

export const engine = new Engine();
