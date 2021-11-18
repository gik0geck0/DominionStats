import { LightningElement } from 'lwc';
import { extractPlayerStats, getRawResults,extractTwoPlayerStats } from 'my/resultsFetcher';


export default class twoPlayerRankingTable extends LightningElement {

    tableData = [];
    async connectedCallback() {
        this.tableData = extractTwoPlayerStats(await getRawResults());
    }
}





