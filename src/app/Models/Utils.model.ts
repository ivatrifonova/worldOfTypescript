import { TeamType } from "../Enums/Enums";

class Utils {
    convertCoordinatesFromStringToNumber(coordinates: string): number[] {
        return coordinates.split(",").map(coordinate => Number(coordinate));
    }

    selectTeam(team: string): TeamType{
        if (team.toUpperCase() === TeamType.Blue) {
            return TeamType.Blue;
        } else if (team.toUpperCase() === TeamType.Red) {
            return TeamType.Red;
        } else {
            throw new Error(`Team ${team} does not exist!`);
        }
    }
}

let utils = new Utils();

export default utils;