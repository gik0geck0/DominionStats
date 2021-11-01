import { LightningElement } from 'lwc';


export default class PlayerSelectCombo extends LightningElement {

    value = '1';

    get options() {
        return [
            { label: 'Player 1', value: '1' },
            { label: 'Player 2', value: '2' },
            { label: 'Player 3', value: '3' },
            { label: 'Player 4', value: '4' },
            { label: 'Player 5', value: '5' },
            { label: 'Player 6', value: '6' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }
}