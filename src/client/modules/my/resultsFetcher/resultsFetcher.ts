interface GameResultsData {
    id: number;
    game_label: string;
    player_num: number;
    player_name: string;
    victory_points: number;
}

interface PlayerStatsAllGames {
    id: number;
    player_name: string;
    num_first_place: number;
    total_victory_points: number;
    num_games: number;
}

let cachedData: GameResultsData[] = [];

export function getRawResults(): Promise<GameResultsData[]> {
    if (cachedData && !cachedData.length) {
        return fetch('/api/v1/gameLogs')
            .then(response => response.json())
            .then(data => {
                cachedData = data as GameResultsData[];
                return data ;
            });
    }
    return new Promise((resolve) => resolve(cachedData));
}
export function extractPlayerStats(resultsData: GameResultsData[]): PlayerStatsAllGames[] {
    let PlayerStats: PlayerStatsAllGames[] = [];
   for (var i in resultsData){
       if(!PlayerStats.find(o => o.player_name == resultsData[i].player_name)){
        PlayerStats.push({id: PlayerStats.length +1,player_name: resultsData[i].player_name,num_first_place: 0, total_victory_points: 0, num_games: 0})
       }
       for (var j in PlayerStats){
            if(PlayerStats[j].player_name == resultsData[i].player_name){
                PlayerStats[j].num_games++;
                PlayerStats[j].total_victory_points += resultsData[i].victory_points;
                if(resultsData[i].player_num == 1){
                    PlayerStats[j].num_first_place++;
                }
            }
       }
   }
   return PlayerStats;
}