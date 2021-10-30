import { LightningElement } from 'lwc';

function getData() {
    /*
    return fetch('/api/v1/gameLogs')
        .then(response => response.json());
    */
    return Promise.resolve([{
        id: 0,
        game_label: "20210521a",
        player_num: 5,
        player_name: "Matt",
        victory_points: 14,
        place: 3
    }, {
        id: 1,
        game_label: "20210521b",
        player_num: 2,
        player_name: "Matt",
        victory_points: 38,
        place: 2
    }, {
        id: 2,
        game_label: "20210521c",
        player_num: 3,
        player_name: "Matt",
        victory_points: 22,
        place: 1
    }, {
        id: 3,
        game_label: "20210521d",
        player_num: 2,
        player_name: "Matt",
        victory_points: 30,
        place: 2
    }]);
}

const placeNumberToString = ['Zeroth', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'];   // lazy way to convert; fine given we have a very small list

export default class GraphExample extends LightningElement {
    victoryPointTrendData = [];
    placeFrequencyData = [];

    async renderedCallback() {
        // Avoids some infinite loop of trying to re-render. No idea why
        if (!this.hasRendered) {
            this.hasRendered = true;
            const data = (await getData()).filter((d) => d.player_name === "Matt");
            this.victoryPointTrendData = data;

            // unlike the scatterPlot component/data, we need to do some preparation on the placeFrequencyData

            // Passing through an object first guarantees that we uniquely identify and count each place (for any number of places in the game)
            const placeFrequencyMap = data.reduce((accum, d) => {
                console.log("PlaceFrequencyMap:", accum);
                const placeLabel = placeNumberToString[d.place]
                if (accum[placeLabel]) {
                    accum[placeLabel]++;
                } else {
                    accum[placeLabel] = 1;
                }
                return accum;
            }, {});
            console.log("PlaceFrequencyMap Finally:", placeFrequencyMap);

            // Convert the data into the [{name, value}] format that donutChart expects
            this.placeFrequencyData = Object.entries(placeFrequencyMap).map(([place, count]) => {
                return {name: place, value: count};
            });
        } else {
            console.log("Blocked a re-render propagation");
        }
    }
}