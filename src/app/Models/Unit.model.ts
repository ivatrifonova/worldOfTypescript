import WorldObject from './worldObject.model';
import { UnitType, TeamType } from '../Enums/Enums';
import { Position, FightDamage } from '../Interfaces/Interfaces';
import utils from './Utils.model';

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
    const unitsToAttack: Unit[] | string = utils.findUnitsAtCoordinates(this);

    if (typeof unitsToAttack === 'string') {
      return unitsToAttack;
    }

    const defender: Unit = utils.chooseRandomUnit(unitsToAttack);

    const { attackerDamage, defenderDamage }:FightDamage = utils.resolveOrdinaryFight(this,defender);

    const deadUnits: number = utils.clearBattlefield([this, defender]);

    return `There was a fierce fight between ${this.name} and ${defender.name}.
     The defender took totally ${attackerDamage} damage. The attacker took ${defenderDamage} damage.
      There are ${deadUnits} dead units after the fight was over`;
  }

  public ninjaAttack(): string {
    const unitsToAttack: Unit[] | string = utils.findUnitsAtCoordinates(this);

    if (typeof unitsToAttack === 'string') {
      return unitsToAttack;
    }

    const allDefendersNames: string = unitsToAttack.map((unit) => unit.name).join(', ');

     const  { attackerDamage, defenderDamage }:FightDamage = utils.resolveNinjaFight(this, unitsToAttack);
     const deadUnits:number = utils.clearBattlefield(unitsToAttack);

    return `There was a fierce fight between ${this.name} and ${allDefendersNames}.
    The defender took totally ${attackerDamage} damage. The attacker took ${defenderDamage} damage.
     There are ${deadUnits} dead units after the fight was over`;
  }

  public gather(): string {
    return '';
  }
}
