import { LightningElement } from 'lwc';
import { extractPlayerStats, getRawResults, extractFivePlayerStats } from 'my/resultsFetcher';


export default class sixPlayerRankingTable extends LightningElement {

    tableData = [];
    async connectedCallback() {
        this.tableData = extractFivePlayerStats(await getRawResults());
    }
}





