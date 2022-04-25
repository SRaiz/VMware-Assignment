import { api, LightningElement } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';

export default class RefreshRecordFromFlowLwc extends LightningElement {
    @api recordId;

    connectedCallback() {
        updateRecord({ fields: { Id: this.recordId }});
    }
}