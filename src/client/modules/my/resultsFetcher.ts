// // modules/my/resultsFetcher/resultsFetcher.ts

// // Roughly matches the DB schema
// interface GameResultsData {
// 	id: number;
// 	game_label: string;
// 	player_num: number;
// 	player_name: string;
// 	victory_points: number;
// }

// let cachedData: GameResultsData[] = [];

// export function getRawResults(): Promise<GameResultsData[]> {
// 	if (!cachedData) {
// 		return fetch('/api/v1/gameLogs')
// 			.then(response => response.json())
// 			.then(data => {
// 				cachedData = data as GameResultsData[];
// 				return data
// 			});
// 	}
// 	return new Promise((resolve) => resolve(cachedData));
// }

// export function extractPlayerStats(resultsData: GameResultsData[]): PlayerStats[] {
//     // TODO
// }