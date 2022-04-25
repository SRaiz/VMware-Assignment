import { api, LightningElement } from 'lwc';

export default class PublisherBookLwc extends LightningElement {
    @api recordId;
    publisherBookHeader;
    publisherBookIcon;
    
    //-- Connected callback lifecycle function --//
    connectedCallback() {
        this.publisherBookHeader = 'Published Books (0)';
        this.publisherBookIcon = 'custom:custom55';
    }

    //-- Handle update header event --//
    handleUpdateHeader(event) {
        const booksOnPublisherCount = event.detail;
        this.publisherBookHeader = `${this.publisherBookHeader.slice(0,15)} (${booksOnPublisherCount})`;
    }
}