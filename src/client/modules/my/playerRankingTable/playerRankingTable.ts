import { LightningElement } from 'lwc';
import { getRawResults } from 'my/resultsFetcher';
import { extractPlayerStats } from 'my/resultsFetcher';


export default class PlayerRankingTable extends LightningElement {

    tableData = [];
    async connectedCallback() {
        this.tableData = extractPlayerStats(await getRawResults());
    }

}



