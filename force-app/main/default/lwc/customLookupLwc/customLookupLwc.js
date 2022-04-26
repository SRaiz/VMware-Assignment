import { api, LightningElement } from 'lwc';
import fetchCustomLookUpValues from '@salesforce/apex/CustomLookUpController.fetchCustomLookUpValues';
import fetchLookUpValues from '@salesforce/apex/CustomLookUpController.fetchLookUpValues';

export default class CustomLookupLwc extends LightningElement {
    @api objectApiName;
    @api iconName = 'standard:account';
    @api label = 'Lookup';
    @api fields = null;
    @api fieldName = null;
    @api tableRowId = null;     //-- Added this tableRowId for passing the row id when lookup used in table --//

    resultClass;
    selectedRecord = null;
    results = [];
    message = null;
    showSpinner = false;
    lastSearchValue;

    constructor() {
        super();
        this.switchResult(false);
    }

    handleSearchTerm(event) {
        let searchValue = event.detail;
        if (searchValue) {
            this.switchResult(true);
            this.message = 'searching...';
            this.showSpinner = true;
            let searchParams = {
                searchKeyWord: searchValue,
                objectName: this.objectApiName
            };
            if (this.fields) {
                this.addFieldsToParam(searchParams);
                fetchCustomLookUpValues(searchParams)
                    .then(result => this.setResult(result))
                    .catch(error => this.handleError(error));
            } else {
                fetchLookUpValues(searchParams)
                    .then(result => this.setResult(result))
                    .catch(error => this.handleError(error));
            }
        } else {
            this.switchResult(false);
            this.message = null;
            this.showSpinner = false;
            this.results = [];
        }
        this.lastSearchValue = searchValue;
    }

    /* 
        This method is going to add fields in the query. Since in the customlokupcontroller, we already have
        id and name parameter in the query, so we should make sure that we have Name and Id always in the query
    */
    addFieldsToParam(searchParam) {
        let allFields = this.fields.split(',');
        allFields.push('Id');
        allFields.push('Name');
        let cleanFields = this.deduplicateArray(allFields).join(',');
        searchParam.fieldsToQuery = cleanFields;
    }

    deduplicateArray(incomingField) {
        var uniqEs6 = arrArg => {
            return arrArg.filter((elem, pos, arr) => {
                return arr.indexOf(elem) === pos;
            });
        };
        return uniqEs6(incomingField);
    }

    setResult(newValues) {
        this.showSpinner = false;
        if (newValues && newValues.length > 0) {
            this.message = null;
            this.results = newValues;
        } else {
            this.message = 'no results found';
        }
    }

    handlePillRemove() {
        this.selectedRecord = null;
        this.dispatchSelectionResult();
        
        // Restore the last results
        this.switchResult(this.lastSearchValue && this.results);
    }

    /*
        This method is going to send the event when the value is changed in the lookup
        And also gets fires when the records get selected in the lookup. valuechanged event is for value change 
     */ 
    dispatchSelectionResult() {
        let eventName = this.fieldName ? 'valueChanged' : 'recordselected';
        let payload = {
            canceled : this.selectedRecord ? true : false,
            recordId : this.selectedRecord,
            value : this.selectedRecord,
            name : this.fieldName,
            tableRowId : this.tableRowId,
            tableRowProductId : this.tableRowProductId
        };
        let selected = new CustomEvent(eventName, {
            detail : payload,
            bubbles : true,
            cancelable : true
        });
        this.dispatchEvent(selected);
    }

    handleError(error) {
        this.showSpinner = false;
        this.message = "Sorry didn't work!";
        let errorDispatch = new CustomEvent('failure', { detail: error });
        this.dispatchEvent(errorDispatch);
    }

    handleRecordSelect(event) {
        this.selectedRecord = event.detail;
        this.dispatchSelectionResult();
        this.switchResult(false);
    }

    //-- This method shows and hides the result area on the page--//
    switchResult(correct) {
        this.resultClass = correct ? 'slds-form-element slds-lookup slds-is-open' : 'slds-form-element slds-lookup slds-is-close';
    }
}