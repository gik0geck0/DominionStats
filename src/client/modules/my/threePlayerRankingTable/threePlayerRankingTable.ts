import { LightningElement } from 'lwc';
import { extractPlayerStats, getRawResults, extractThreePlayerStats } from 'my/resultsFetcher';


export default class sixPlayerRankingTable extends LightningElement {

    tableData = [];
    async connectedCallback() {
        this.tableData = extractThreePlayerStats(await getRawResults());
    }
}





