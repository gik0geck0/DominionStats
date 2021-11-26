import { LightningElement } from 'lwc';

export default class DataUploader extends LightningElement {

    /**
     * Retrieves the data from the input fields and makes a query to upload it to the database api.
     */
    gatherDataAndSend(): void {

        let playerData = []; //data for each player input

        //get entered player data
        for(let x = 0; x < 6; x++) {
            playerData.push({
                "playerName": this.getValueFromInput("playerName" + (x+1).toString()),
                "victoryPoints": parseInt(this.getValueFromInput("victoryPoints" + (x+1).toString()), 10)
            });
        }

        //data for post
        let data = {
            "gameId": this.getValueFromInput("gameId"),
            "playerData": playerData
        };

        let errorMessages = this.validateInput(data) //validate input data

        //if no errors were found
        if(errorMessages.length == 0) {

            let newPlayerData = [] //player data without blank entries
            
            //remove blank input entries
            for(let playerEntry of data.playerData) {
                if(playerEntry.playerName!== "" && !Object.is(playerEntry.victoryPoints, NaN)) {
                    newPlayerData.push({
                        "playerName": playerEntry.playerName, "victoryPoints": playerEntry.victoryPoints
                    });
                }
            }

            data.playerData = newPlayerData; //reassign data

            console.log("Sending data: ", data);

            //send POST request to api
            fetch("api/v1/gameResultsTest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                
                //check response from server
                if(response.status == 200)
                    location.reload(); //refresh page

                else if(response.status >= 400) {

                    this.template.querySelector("p[name=\"errorMessage\"]").textContent = 
                            "Something went wrong with the data upload. Please try again.";
                    this.template.querySelector("p[name=\"errorMessage\"]").hidden = false;

                }

            });

        }
        else {

            let errorString = ""; //full error message

            //build error message
            for(let error of errorMessages)
                errorString += error + "\n";
    
            this.template.querySelector("p[name=\"errorMessage\"]").textContent = errorString; //set error text
            this.template.querySelector("p[name=\"errorMessage\"]").hidden = false; //show error message

        }

    }

    /** 
     * Gets the value from the input field with the given name.
     * Parameters:
     *  name: The name of the input field in HTML.
     * Returns:
     *  The value currently in the input field. Can be null.
    */
    getValueFromInput(name: string): any {
        return this.template.querySelector("input[name=\"" + name + "\"]").value
    }

    /**
     * Validates the input from the form.
     * Parameters:
     *  input: The object containing the input data.
     * Returns:
     *  A list of error messages that were found during validation. If the data is valid, the list will be empty.
     */
    validateInput(input: object) : string[] {

        let isDataValid = true; //whether the data is valid
        let errors = []; //list of error messages

        //check game id
        if(!input["gameId"]) {
            errors.push("Game ID cannot be blank.");
            isDataValid = false;
        }

        //check each player/victory point pair
        for(let x = 0; x < input["playerData"].length; x++) {

            //check entries are full
            if((input["playerData"][x]["playerName"] && !input["playerData"][x]["victoryPoints"]) || 
                    (!input["playerData"][x]["playerName"] && input["playerData"][x]["victoryPoints"])) {

                errors.push("Non-blank entries must have a player name and a victory point count.");
                isDataValid = false;

            }

            //check first entry is not empty
            if(x == 0 && !input["playerData"][x]["playerName"] && !input["playerData"][x]["victoryPoints"]) {
                errors.push("First entry cannot be blank.");
                isDataValid = false;
            }

            //check no entries out of order
            if(x > 0 && 
                    (input["playerData"][x]["playerName"] && input["playerData"][x]["victoryPoints"]) && 
                    (!input["playerData"][x-1]["playerName"] && !input["playerData"][x-1]["victoryPoints"])) {

                errors.push("Please leave no blank rows before entries.");
                isDataValid = false;

            }

        }

        //check >1 entry

        let numNonBlankEntries = 0; //total non blank entries

        //find all valid entries
        for(let row of input["playerData"])
            if(row["playerName"]!== "" && !Object.is(row["victoryPoints"], NaN))
                numNonBlankEntries++;

        if(numNonBlankEntries <= 1)
            errors.push("Input must have at least two entries.");

        //check descending victory points

        let lastScore = Number.POSITIVE_INFINITY; //last visited score

        //validate points
        for(let x = 0; x < input["playerData"].length; x++) {

            //only check non blank entries
            if(!Object.is(input["playerData"][x]["victoryPoints"], NaN)) {

                //make sure score is less than previous score
                if(input["playerData"][x]["victoryPoints"] > lastScore) {

                    errors.push("Please order entries in decreasing victory point order.");
                    break;

                }

                lastScore = input["playerData"][x]["victoryPoints"];

            }

        }

        return errors;

    }

}