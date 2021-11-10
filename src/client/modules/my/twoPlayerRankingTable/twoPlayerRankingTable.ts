import { LightningElement } from 'lwc';
import { extractPlayerStats, getRawResults } from 'my/resultsFetcher';


export default class sixPlayerRankingTable extends LightningElement {

    tableData = [];
    async connectedCallback() {
        this.tableData = extractPlayerStats(await getRawResults(),2);
    }
}





