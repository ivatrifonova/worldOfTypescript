import WorldObject from './worldObject.model';
import { UnitType, TeamType } from '../Enums/Enums';
import { Position } from '../Interfaces/Interfaces';
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

  go(coordinates: string): string {
    this.modifyPosition(coordinates)

    return `Unit ${this.name} moved to ${this.position.x},${this.position.y}`;
  }

  gather(): string {
    
    const resourcePresence = engine.resources.find(resource => resource.position.x === this.position.x 
      && resource.position.y === this.position.y);

    if (resourcePresence) {
      if (this.type === UnitType.Guard || this.type === UnitType.Ninja || 
        this.type === UnitType.Giant && resourcePresence.type.toLowerCase() !== 'lumber') {
          return 'You cannot gather that.';
      }
      
      resourcePresence.team = this.team;
      let teamFoodArr: number[] = [0];
      let teamLumberArr: number[] = [0];
      let teamIronArr: number[] = [0];

      const resourceIndex = engine.resources.findIndex(resource => resource.position.x === resourcePresence.position.x 
        && resource.position.y === resourcePresence.position.y);
      engine.resources.splice(resourceIndex, 1);
      engine.gatheredResources.push(resourcePresence);

      const teamResources = engine.gatheredResources.filter(resource => resource.team === this.team);
      
      const teamFoodFound = teamResources.filter(resource => resource.type.toLowerCase() === 'food');
      teamFoodFound.map(foodResource => teamFoodArr.push(foodResource.healthPoints));
      const teamFoodQuantity =  teamFoodArr.reduce((prevFood, currFood) => prevFood + currFood);

      const teamLumberFound = teamResources.filter(resource => resource.type.toLowerCase() === 'lumber');
      teamLumberFound.map(lumberResource =>  teamLumberArr.push(lumberResource.healthPoints));
      const teamLumberQuantity = teamLumberArr.reduce((prevLumber, currLumber) => prevLumber + currLumber);

      const teamIronFound = teamResources.filter(resource => resource.type.toLowerCase() === 'iron');
      teamIronFound.map(ironResource => teamIronArr.push(ironResource.healthPoints));
      const teamIronQuantity = teamIronArr.reduce((prevIron, currIron) => prevIron + currIron);
      
      return `Successfully gathered ${resourcePresence.healthPoints} ${resourcePresence.type}. 
      Team ${this.team} now has ${teamFoodQuantity} food, ${teamLumberQuantity} lumber and ${teamIronQuantity} iron.`;
    } else {
      return 'There is nothing to gather';
    }
      
    }
}
