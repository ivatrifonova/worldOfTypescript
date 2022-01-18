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
