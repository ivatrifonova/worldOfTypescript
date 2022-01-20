import { Unit } from '../Classes/Unit';
import { Resource } from '../Classes/Resource';
import { UnitType, ResourceTypes, TeamType } from '../Enums/Enums';
import { constants } from './Constants';
import {
  createPosition,
  validateUnit,
  selectTeam,
  validateResource,
  findUnit,
} from '../Classes/Utils';
import {
  showAll,
  showUnits,
  showResources,
  showCoordinates,
} from '../Classes/Show';

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

  public createUnit(
    [, , , position, team, type]: string[],
    name: string
  ): string {
    let newUnit: Unit;
    const unitPosition = createPosition(position);

    const validUnit = validateUnit(name, position, team);

    if (validUnit) {
      return validUnit;
    }

    const teamType = selectTeam(team);
    switch (type) {
      case 'peasant':
        newUnit = new Unit(
          constants.PEASANT.isDestroyed,
          constants.PEASANT.health,
          unitPosition,
          constants.PEASANT.canMove,
          teamType,
          name,
          constants.PEASANT.attack,
          constants.PEASANT.defense,
          UnitType.Peasant,
          constants.PEASANT.canGather
        );
        break;
      case 'guard':
        newUnit = new Unit(
          constants.GUARD.isDestroyed,
          constants.GUARD.health,
          unitPosition,
          constants.GUARD.canMove,
          teamType,
          name,
          constants.GUARD.attack,
          constants.GUARD.defense,
          UnitType.Guard,
          constants.GUARD.canGather
        );
        break;
      case 'ninja':
        newUnit = new Unit(
          constants.NINJA.isDestroyed,
          constants.NINJA.health,
          unitPosition,
          constants.NINJA.canMove,
          teamType,
          name,
          constants.NINJA.attack,
          constants.NINJA.defense,
          UnitType.Ninja,
          constants.NINJA.canGather
        );
        break;
      case 'giant':
        newUnit = new Unit(
          constants.GIANT.isDestroyed,
          constants.GIANT.health,
          unitPosition,
          constants.GIANT.canMove,
          teamType,
          name,
          constants.GIANT.attack,
          constants.GIANT.defense,
          UnitType.Giant,
          constants.GIANT.canGather
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

    const validResource = validateResource(position, type, convertedQuantity);
    const resourcePosition = createPosition(position);
    if (validResource) {
      return validResource;
    }

    switch (type) {
      case 'food':
        newResource = new Resource(
          constants.RESOURCE.isDestroyed,
          convertedQuantity,
          resourcePosition,
          constants.RESOURCE.canMove,
          TeamType.Neutral,
          ResourceTypes.Food
        );
        break;
      case 'lumber':
        newResource = new Resource(
          constants.RESOURCE.isDestroyed,
          convertedQuantity,
          resourcePosition,
          constants.RESOURCE.canMove,
          TeamType.Neutral,
          ResourceTypes.Lumber
        );
        break;
      case 'iron':
        newResource = new Resource(
          constants.RESOURCE.isDestroyed,
          convertedQuantity,
          resourcePosition,
          constants.RESOURCE.canMove,
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

  public order([, , type, coordinates]: string[], name: string): string {
    const unit = findUnit(name);
    if (typeof unit === 'string') {
      return unit;
    }

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
  public create(commands: string[], name: string): string {
    switch (commands[1]) {
      case 'unit':
        return this.createUnit(commands, name);
      case 'resource':
        return this.createResource(commands);
      default:
        return `You can only create unit or resource.`;
    }
  }
}

export const engine = new Engine();
