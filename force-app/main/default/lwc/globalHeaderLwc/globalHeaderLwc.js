import { api, LightningElement } from 'lwc';

export default class GlobalHeaderLwc extends LightningElement {
    @api headerName;
    @api iconName;
    @api wantAbsoluteCentre = false;

    get headerClass() {
        return this.wantAbsoluteCentre ? 'slds-media__body slds-align_absolute-center' : 'slds-media__body slds-m-top_xx-small';
    }
}