import { LightningElement } from 'lwc';
import { extractPlayerStats, getRawResults, extractSixPlayerStats } from 'my/resultsFetcher';


export default class sixPlayerRankingTable extends LightningElement {

    tableData = [];
    async connectedCallback() {
        this.tableData = extractSixPlayerStats(await getRawResults());
    }
}





