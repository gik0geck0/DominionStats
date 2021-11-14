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
        console.log("Getting data from input field with name " + name);
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

        //check game id
        if(!input["gameId"]) {

            this.template.querySelector("p[name=\"errorMessage\"]").textContent = "Game ID cannot be blank.";

            return false;

        }

        //check each player/victory point pair
        for(let x = 0; x < input["playerData"].length; x++) {

            //check entries are full
            if((input["playerData"][x]["playerName"] && !input["playerData"][x]["victoryPoints"]) || 
                (!input["playerData"][x]["playerName"] && input["playerData"][x]["victoryPoints"])) {

                this.template.querySelector("p[name=\"errorMessage\"]").textContent = 
                    "Non-blank entries must have a player name and a victory point count.";

                return false;

            }

            //check first entry is not empty
            if(x == 0 && !input["playerData"][x]["playerName"] && !input["playerData"][x]["victoryPoints"]) {

                this.template.querySelector("p[name=\"errorMessage\"]").textContent = 
                    "First entry cannot be blank.";

                return false;

            }

            //check no entries out of order
            if(x > 0 && 
                (input["playerData"][x]["playerName"] && input["playerData"][x]["victoryPoints"]) && 
                (!input["playerData"][x-1]["playerName"] && !input["playerData"][x-1]["victoryPoints"])) {

                this.template.querySelector("p[name=\"errorMessage\"]").textContent = 
                    "Please leave no blank rows before entries.";

                return false;

            }

        }

        return true;

    }

}