import WorldObject from './worldObject';
import { UnitType, TeamType } from '../Enums/Enums';
import {
  FightDamage,
  Position as PositionInterface,
  Unit as UnitInterface,
} from '../Interfaces/Interfaces';
import { engine } from '../Engine/Engine';
import {
  calculateDeadUnits,
  calculateResourceQuantity,
  chooseRandomUnit,
  findUnitsAtCoordinates,
  moveGatheredResource,
  resolveNinjaFight,
  resolveOrdinaryFight,
  validatePosition,
} from './Utils';

export class Unit extends WorldObject implements UnitInterface {
  private _name: string;
  private _attack: number;
  private _defence: number;
  private _type: UnitType;
  private _canGather: boolean;

  public get name(): string {
    return this._name;
  }

  public get attack(): number {
    return this._attack;
  }

  public get defence(): number {
    return this._defence;
  }
  public get type(): UnitType {
    return this._type;
  }

  public get canGather(): boolean {
    return this._canGather;
  }

  constructor(
    isDestroyed: boolean,
    healthPoints: number,
    position: PositionInterface,
    canMove: boolean,
    team: TeamType,
    name: string,
    attack: number,
    defence: number,
    type: UnitType,
    canGather: boolean
  ) {
    super(isDestroyed, healthPoints, position, canMove, team);
    this._name = name;
    this._attack = attack;
    this._defence = defence;
    this._type = type;
    this._canGather = canGather;
  }

  public ordinaryAttack(): string {
    const unitsToAttack = findUnitsAtCoordinates(this);

    if (typeof unitsToAttack === 'string') {
      return unitsToAttack;
    } else if (this.isDestroyed) {
      return 'This unit is dead!';
    }

    const defender = chooseRandomUnit(unitsToAttack);

    const { attackerDamage, defenderDamage }: FightDamage =
      resolveOrdinaryFight(this, defender);

    const deadUnits = calculateDeadUnits([this, defender]);

    return `There was a fierce fight between ${this.name} and ${defender.name}.
     The defender took totally ${attackerDamage} damage. The attacker took ${defenderDamage} damage.
      There are ${deadUnits} dead units after the fight was over`;
  }

  public ninjaAttack(): string {
    const unitsToAttack = findUnitsAtCoordinates(this);

    if (typeof unitsToAttack === 'string') {
      return unitsToAttack;
    } else if (this.isDestroyed) {
      return 'This unit is dead!';
    }

    const allDefendersNames = unitsToAttack.map((unit) => unit.name).join(', ');

    const { attackerDamage, defenderDamage }: FightDamage = resolveNinjaFight(
      this,
      unitsToAttack
    );

    const deadUnits = calculateDeadUnits(unitsToAttack);

    return `There was a fierce fight between ${this.name} and ${allDefendersNames}.
    The defender took totally ${attackerDamage} damage. The attacker took ${defenderDamage} damage.
     There are ${deadUnits} dead units after the fight was over`;
  }

  public go(coordinates: string): string {
    const validCoordinates = validatePosition(coordinates);
    if (validCoordinates) {
      return `The position is not valid.`;
    } else if (this.isDestroyed) {
      return 'This unit is dead!';
    } else {
      this.modifyPosition(coordinates);
      return `Unit ${this.name} moved to ${this.position.x},${this.position.y}`;
    }
  }

  public gather(): string {
    if (this.isDestroyed) {
      return 'This unit is dead!';
    }

    const resourcePresence = engine.resources.find(
      (resource) =>
        resource.position.x === this.position.x &&
        resource.position.y === this.position.y
    );

    if (resourcePresence) {
      const isItGiant =
        this.type === UnitType.Giant &&
        resourcePresence.type.toLowerCase() !== 'lumber';
      if (
        this.type === UnitType.Guard ||
        this.type === UnitType.Ninja ||
        isItGiant
      ) {
        return 'You cannot gather that.';
      }

      resourcePresence.team = this.team;
      moveGatheredResource(resourcePresence);
      const teamFoodQuantity = calculateResourceQuantity(
        'food',
        resourcePresence.team
      );
      const teamLumberQuantity = calculateResourceQuantity(
        'lumber',
        resourcePresence.team
      );
      const teamIronQuantity = calculateResourceQuantity(
        'iron',
        resourcePresence.team
      );

      return `Successfully gathered ${
        resourcePresence.healthPoints
      } ${resourcePresence.type.toLowerCase()}. 
      Team ${this.team.toLowerCase()} now has ${teamFoodQuantity} food, ${teamLumberQuantity} lumber and ${teamIronQuantity} iron.`;
    } else {
      return 'There is nothing to gather';
    }
  }
}
