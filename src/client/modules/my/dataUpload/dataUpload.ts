import { LightningElement } from 'lwc';

export default class DataUploader extends LightningElement {

    /**
     * Retrieves the data from the input fields and makes a query to upload it to the database api.
     */
    gatherDataAndSend() {

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

        console.log(data);

        if(this.validateInput(data)) {

            //send POST request to api
            fetch("api/v1/gameLogs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                console.log("Got response: ", response);
                return response.json();
            })
            .then(returnedData => {
                console.log("Successfully uploaded: ", returnedData);
            })
            .catch((error) => {
                console.log("Error uploading data: ", error);
            });

        }
        else {

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
    getValueFromInput(name) {
        return this.template.querySelector("input[name=\"" + name + "\"]").value
    }

    /**
     * Validates the input from the form.
     * Parameters:
     *  input: The object containing the input data.
     * Returns:
     *  True if the data is good to be sent to the database, false otherwise.
     */
    validateInput(input) {

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

        let errorString = ""; //full error message

        //build error message
        for(let error in errors)
            errorString += error + "\n";

        this.template.querySelector("p[name=\"errorMessage\"]").textContent = errorString; //set error text

        return isDataValid;

    }

}