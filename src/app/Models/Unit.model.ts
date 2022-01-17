import WorldObject from './worldObject.model';
import { UnitType, TeamType } from '../Enums/Enums';
import { Position } from '../Interfaces/Interfaces';
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
  get name(): string {
    return this._name;
  }

  get type(): string {
    return this._type;
  }

  get attack(): number {
    return this._attack;
  }

  get defence(): number {
    return this._defence;
  }

  ordinaryAttack(): string {
    let unitsToAttack = utils.findUnitsAtCoordinates(this.position, this.team, this.name);
    let deadUnits: number = 0;

    if (typeof unitsToAttack === 'string') {
      return unitsToAttack;
    }
    let randomUnitForAttack = utils.chooseRandomUnit(unitsToAttack);

    let criticalHit = utils.isHitCritical();
    let attackerDamage = utils.calculateDamage(this.attack, randomUnitForAttack.defence);

    if (criticalHit) {
      randomUnitForAttack.modifyHealthPoints(-attackerDamage * 2);
      attackerDamage *= 2;
    } else {
      randomUnitForAttack.modifyHealthPoints(-attackerDamage);
    }

    let defenderDamage = utils.calculateDamage(randomUnitForAttack.attack, this.defence);
    this.modifyHealthPoints(-defenderDamage);
    console.log(this.healthPoints)
    console.log(randomUnitForAttack.healthPoints)

    if (this.healthPoints <= 0) {
      this.isDestroyed = true;
      deadUnits += 1;
    } else if (randomUnitForAttack.healthPoints < 0) {
      randomUnitForAttack.isDestroyed = true;
      deadUnits += 1;
    }

    return `There was a fierce fight between ${this.name} and ${randomUnitForAttack.name}.
     The defender took totally ${attackerDamage} damage. The attacker took ${defenderDamage} damage.
      There are ${deadUnits} dead units after the fight was over`;
  }

  ninjaAttack(): string {
    return '';
  }

  gather(): string {
    return "";
  }
}
