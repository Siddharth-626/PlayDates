import { PlayersType } from "./Type";

export const PlayersBasedOnPrefernce = (Prefernce: string, Players: PlayersType[] | undefined) => {
    if (!Players || Players.length < 2) return;

    const selectedPlayers: PlayersType[] = []

    let teamSize;
    if (Prefernce != undefined && typeof Prefernce === "string" && Prefernce.toLocaleLowerCase().includes("singles")) {
        teamSize = 2;
    }
    else if (Prefernce != undefined && typeof Prefernce === "string" && Prefernce.toLocaleLowerCase().includes("doubles")) {
        teamSize = 4;
    }
    else {
        teamSize = 2;
    }

    for (let i = 0; i < Math.min(teamSize, Players.length); i++) {
        selectedPlayers.push(Players[i])
    }
    return selectedPlayers;
}