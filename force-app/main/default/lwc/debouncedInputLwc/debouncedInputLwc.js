import { api, LightningElement } from 'lwc';

export default class DebouncedInputLwc extends LightningElement {
    @api label = 'Lookup';
    @api delay = 300;
    @api value;
    @api labelVariant = 'label-inline';
    @api fieldName = null;

    constructor() {
        super();
        this.timeout = null;
    }

    //-- This handler is going to call the onchange event after the time delay and bubble the change event after debouncing --//
    handleChange(event) {
        event.stopPropagation();
        window.clearTimeout(this.timeout);
        let searchTerm = event.target.value;
        
        this.timeout = window.setTimeout(() => {
            this.fireChangeEvent(searchTerm);
        }, this.delay);
    }

    //-- This method fires the custom event with the actual changed value --//
    fireChangeEvent(searchTerm) {
        let eventName = this.fieldName ? 'valueChanged' : 'change';
        let payload = this.fieldName ? { name: this.fieldName, value: this.searchTerm } : searchTerm;
        let customChange = new CustomEvent( eventName, {
            detail: payload,
            bubbles: true,
            cancelable: true
        });
        this.dispatchEvent(customChange);
    }
}