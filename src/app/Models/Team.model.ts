import {Resource} from "./Resource.model";
import {Unit} from "./Unit.model";
import {TeamType} from "../Enums/Enums";

export class Team {
    private _resources: Resource[];
    private _units: Unit[];

    constructor(
        private _teamColor: TeamType
    ) {}
}