import { LightningElement } from 'lwc';
import { getRawResults } from 'my/resultsFetcher';


export default class PlayerRankingTable extends LightningElement {

    tableData = [];
    async connectedCallback() {
        this.tableData = await getRawResults();
        console.log(await getRawResults());
    }
    
     //getData() {

    //     //eventual function to return a processed list of data to place into the table
    
    //     return [
    //         {
    //             date: "20200911a",
    //             name: "Shelby",
    //             ranking: 1,
    //             victoryPoints: 53
    //         },
    //         {
    //             date: "20200911a",
    //             name: "Troy",
    //             ranking: 2,
    //             victoryPoints: 38
    //         },
    //         {
    //             date: "20200911a",
    //             name: "Joe",
    //             ranking: 3,
    //             victoryPoints: 27
    //         }
    //     ];
    
    // }

}



