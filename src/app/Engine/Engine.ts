import { Unit } from '../Models/Unit';
import { Resource } from '../Models/Resource';
import { UnitType, ResourceTypes, TeamType } from '../Enums/Enums';
import { constants } from './Constants';
import {
  createPosition,
  validateUnit,
  selectTeam,
  validateResource,
  findUnit,
} from '../Models/Utils';
import {
  showAll,
  showUnits,
  showResources,
  showCoordinates,
} from '../Models/Show';

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
    const unitPosition = createPosition(position);

    const validUnit = validateUnit(name, position, team);

    if (validUnit) return validUnit;

    const teamType = selectTeam(team);
    switch (type) {
      case 'peasant':
        newUnit = new Unit(
          false,
          constants.PEASANT.health,
          unitPosition,
          true,
          teamType,
          name,
          constants.PEASANT.attack,
          constants.PEASANT.defense,
          UnitType.Peasant,
          true
        );
        break;
      case 'guard':
        newUnit = new Unit(
          false,
          constants.GUARD.health,
          unitPosition,
          true,
          teamType,
          name,
          constants.GUARD.attack,
          constants.GUARD.defense,
          UnitType.Guard,
          false
        );
        break;
      case 'ninja':
        newUnit = new Unit(
          false,
          constants.NINJA.health,
          unitPosition,
          true,
          teamType,
          name,
          constants.NINJA.attack,
          constants.NINJA.defense,
          UnitType.Ninja,
          false
        );
        break;
      case 'giant':
        newUnit = new Unit(
          false,
          constants.GIANT.health,
          unitPosition,
          true,
          teamType,
          name,
          constants.GIANT.attack,
          constants.GIANT.defense,
          UnitType.Giant,
          true
        );
        break;
      default:
        return `This unit type does not exist!`;
    }
    this.units.push(newUnit);
    return `Created ${type} from ${team} team named ${name} at position ${position}.`;
  }

  public createResource([, , type, position, quantity]: string[]): string {
    let newResource: Resource;
    const convertedQuantity = Number(quantity);
    const resourcePosition = createPosition(position);

    const validResource = validateResource(
      resourcePosition,
      type,
      convertedQuantity
    );
    if (validResource) return validResource;

    switch (type) {
      case 'food':
        newResource = new Resource(
          false,
          convertedQuantity,
          resourcePosition,
          false,
          TeamType.Neutral,
          ResourceTypes.Food
        );
        break;
      case 'lumber':
        newResource = new Resource(
          false,
          convertedQuantity,
          resourcePosition,
          false,
          TeamType.Neutral,
          ResourceTypes.Lumber
        );
        break;
      case 'iron':
        newResource = new Resource(
          false,
          convertedQuantity,
          resourcePosition,
          false,
          TeamType.Neutral,
          ResourceTypes.Iron
        );
        break;
      default:
        return `This Resource type does not exist!`;
    }

    this.resources.push(newResource);

    return `Created ${type} at position ${position} with ${quantity} health.`;
  }

  public show([, type, team]: string[]): string {
    switch (type) {
      case 'all':
        return showAll();
      case 'units':
        return showUnits(team);
      case 'resources':
        return showResources();
      case 'coordinates':
        return showCoordinates(team);
      default:
        return `Invalid command. Available options: all, units, resources, coordinates`;
    }
  }

  public order([, currentUnit, type, coordinates]: string[]): string {
    const unit = findUnit(currentUnit);
    if (typeof unit === 'string') return unit;

    switch (type) {
      case 'attack':
        return unit.type === UnitType.Ninja
          ? unit.ninjaAttack()
          : unit.ordinaryAttack();
      case 'gather':
        return unit.gather();
      case `go`:
        return unit.go(coordinates);
      default:
        return `The order is invalid!`;
    }
  }
  public create(commands: string[]): string {
    switch (commands[1]) {
      case 'unit':
        return this.createUnit(commands);
      case 'resource':
        return this.createResource(commands);
      default:
        return `You can only create unit or resource.`;
    }
  }
}

export const engine = new Engine();
