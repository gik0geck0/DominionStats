import { LightningElement, api } from 'lwc';

export default class TestTable extends LightningElement {

    selectedTable = 0
    tableData = this.getData();

    @api
    set table(value: string) {
        if(value == "0")
            this.selectedTable = 0;
        else
            this.selectedTable = 1;
        console.log(value);
    }

    get table() {
        return this.selectedTable.toString();
    }

    getData() {

        console.log("getData: " + this.selectedTable);

        //eventual function to return a processed list of data to place into the table
    
        if(this.selectedTable == 0) {
    
            return [
                {
                    date: "20200911a",
                    name: "Shelby",
                    ranking: 1,
                    victoryPoints: 53
                },
                {
                    date: "20200911a",
                    name: "Troy",
                    ranking: 2,
                    victoryPoints: 38
                },
                {
                    date: "20200911a",
                    name: "Joe",
                    ranking: 3,
                    victoryPoints: 27
                }
            ];

        }

        else {

            return [
                {
                    date: "20200911a",
                    name: "Test",
                    ranking: 1,
                    victoryPoints: 53
                },
                {
                    date: "20200911a",
                    name: "Test",
                    ranking: 2,
                    victoryPoints: 38
                },
                {
                    date: "20200911a",
                    name: "Test",
                    ranking: 3,
                    victoryPoints: 27
                }
            ];

        }
    
    }

}



