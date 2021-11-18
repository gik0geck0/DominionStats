import { LightningElement } from 'lwc';
import { extractPlayerStats, getRawResults, extractFourPlayerStats } from 'my/resultsFetcher';


export default class fourPlayerRankingTable extends LightningElement {

    tableData = [];
    async connectedCallback() {
        this.tableData = extractFourPlayerStats(await getRawResults());
    }
}





