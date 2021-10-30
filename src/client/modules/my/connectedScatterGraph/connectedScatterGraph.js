import { api, LightningElement } from 'lwc';
import { ConnectedScatterplot } from 'my/d3Charts';

// allows type-completion of the global-variable D3, which is assumed to already have been loaded (from script tag)
/*
declare global {
    namespace d3 {}
}
*/

/*
interface GameResultsData {
    id: number;
    game_label: string;
    player_num: number;
    player_name: string;
    victory_points: number;
}
*/


export default class ConnectedScatterGraph extends LightningElement {

    @api graphTitle = "Victory Points Graph";

    // Using a setter gives us a reactive hook to re-render the graph if the data changes
    @api
    set data(d) {
        this._data = d;
        this.renderGraph();
    }
    get data() {
        return this._data;
    }

    _data = [];

    @api xKey = 'game_label';
    @api xLabel = 'Game ID'
    @api yKey = 'victory_points';
    @api yLabel = 'Victory Points';

    // use d3.scalePoint for strings
    // use undefined for numbers (or dates?)
    @api xType = d3.scalePoint;
    @api yType = undefined; // use undefined for numbers, that's the default

    @api width = 1280;
    @api height = 720;

    renderedCallback() {
        this.hasRendered = true;
        // Setter is not called if we are initialized with data, so start off rendering the graph
        this.renderGraph();
    }

    async renderGraph() {
      // The querySelector at the bottom of this function requires that the component has rendered at least once (and is attached to the DOM)
      // If we haven't rendered yet, wait for renderedCallback to be invoked, and draw the graph then
      if (!this.hasRendered)
        return;

      // Grab our data
      const data = this._data;

      // Pass it to the d3 wrapper function
      const xFn = (d) => d[this.xKey];
      const yFn = (d) => d[this.yKey];
      const csElement = ConnectedScatterplot(data, {
          xLabel: this.xLabel,
          x: xFn,
          xType: this.xType, // scalePoint is an ordered list of strings
          xDomain: this.xType !== undefined ? data.map(xFn) : undefined, // build the list of x data-points since the wrapper can't figure it out

          yLabel: this.yLabel,
          y: yFn,
          yType: this.yType,
          yDomain: this.yType !== undefined ? data.map(yFn) : undefined,

          defined: (d, i) => true,  // assume that all data is valid (the default checks for NaN, and strings from scalePoint are NaN)
          width: this.width,
          height: this.height
      });

      // Attach it to the element
      this.template.querySelector(".barchart").replaceChildren(csElement);
    }
}