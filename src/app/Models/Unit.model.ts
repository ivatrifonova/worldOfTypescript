import WorldObject from './worldObject.model';
import { UnitType, TeamType } from '../Enums/Enums';
import { Position, FightDamage } from '../Interfaces/Interfaces';
import utils from './Utils.model';
import { engine } from '../Engine/Engine';

export class Unit extends WorldObject {
  constructor(
    private _name: string,
    private _attack: number,
    private _defence: number,
    private _type: UnitType,
    _healthPoints: number,
    _position: Position,
    _team: TeamType,
    private _canGather: boolean = true,
    _isDestroyed: boolean = false,
    _canMove: boolean = true
  ) {
    super(_isDestroyed, _healthPoints, _position, _canMove, _team);
  }
  public get name(): string {
    return this._name;
  }

  public get type(): string {
    return this._type;
  }

  public get attack(): number {
    return this._attack;
  }

  public get defence(): number {
    return this._defence;
  }

  public ordinaryAttack(): string {
    const unitsToAttack = utils.findUnitsAtCoordinates(this);

    if (typeof unitsToAttack === 'string') {
      return unitsToAttack;
    }

    const defender = utils.chooseRandomUnit(unitsToAttack);

    const { attackerDamage, defenderDamage }:FightDamage = utils.resolveOrdinaryFight(this,defender);

    const deadUnits = utils.clearBattlefield([this, defender]);

    return `There was a fierce fight between ${this.name} and ${defender.name}.
     The defender took totally ${attackerDamage} damage. The attacker took ${defenderDamage} damage.
      There are ${deadUnits} dead units after the fight was over`;
  }

  public ninjaAttack(): string {
    const unitsToAttack = utils.findUnitsAtCoordinates(this);

    if (typeof unitsToAttack === 'string') {
      return unitsToAttack;
    }

    const allDefendersNames = unitsToAttack.map((unit) => unit.name).join(', ');

     const  { attackerDamage, defenderDamage }:FightDamage = utils.resolveNinjaFight(this, unitsToAttack);
     const deadUnits= utils.clearBattlefield(unitsToAttack);

    return `There was a fierce fight between ${this.name} and ${allDefendersNames}.
    The defender took totally ${attackerDamage} damage. The attacker took ${defenderDamage} damage.
     There are ${deadUnits} dead units after the fight was over`;
  }

  public go(coordinates: string): string {
    const convertedCoordinates = utils.convertCoordinatesFromStringToNumber(coordinates);
    const validCoordinates = utils.checkForValidCoordinates(convertedCoordinates);
    if(validCoordinates) {
      this.modifyPosition(coordinates)
      return `Unit ${this.name} moved to ${this.position.x},${this.position.y}`;
    } else {
      return `The position is not valid.`
    }
  }

  public gather(): string {
    const resourcePresence = engine.resources.find(resource => resource.position.x === this.position.x 
      && resource.position.y === this.position.y);

    if (resourcePresence) {
      const isItGiant = this.type === UnitType.Giant && resourcePresence.type.toLowerCase() !== 'lumber'
      if (this.type === UnitType.Guard || this.type === UnitType.Ninja || isItGiant) {
        return 'You cannot gather that.';
      }
      
      resourcePresence.team = this.team;
      utils.moveGatheredResource(resourcePresence);
      const teamFoodQuantity = utils.calculateResourceQuantity('food', resourcePresence.team);
      const teamLumberQuantity = utils.calculateResourceQuantity('lumber', resourcePresence.team);
      const teamIronQuantity = utils.calculateResourceQuantity('iron', resourcePresence.team);
      
      return `Successfully gathered ${resourcePresence.healthPoints} ${resourcePresence.type}. 
      Team ${this.team} now has ${teamFoodQuantity} food, ${teamLumberQuantity} lumber and ${teamIronQuantity} iron.`;
    } else {
      return 'There is nothing to gather';
    }
  }

}