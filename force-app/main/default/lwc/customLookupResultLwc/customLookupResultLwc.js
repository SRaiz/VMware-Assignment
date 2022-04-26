import { api, LightningElement } from 'lwc';

export default class CustomLookupResultLwc extends LightningElement {
    @api iconName;
    @api record;

    handleOnClick = () => {
        let payload = {
            detail : {}
        };
        Object.keys(this.record).forEach((key) => {
            payload.detail[key] = this.record[key];
        })
        let selection = new CustomEvent('selection', payload);
        this.dispatchEvent(selection);
    };

    get fieldNameResults() {
        if (!this.record) {
            return null;
        }
        let gotResult = false;
        let result = [];
        for (let fName in this.record) {
            if ( fName !== 'Id' && fName !== 'Name' && this.record.hasOwnProperty(fName) ) {
                result.push({ 
                    name: fName, 
                    value: this.record[fName] 
                });
                gotResult = true;
            }
        }
        return gotResult ? result : null;
    }
}