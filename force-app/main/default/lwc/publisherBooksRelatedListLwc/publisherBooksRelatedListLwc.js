import { api, LightningElement } from 'lwc';
import fetchBooksToShowOnPublisher from '@salesforce/apex/PublisherBooksDetailsClassBSO.fetchBooksToShowOnPublisher';

//-- Columns to show on custom related list on publisher record page --//
const COLUMNS = [
    { label: 'Name', fieldName: 'bookName', type: 'text', hideDefaultActions: true },
    { label: 'Genre', fieldName: 'genre', type: 'text', hideDefaultActions: true, sortable: true },
    { label: 'Language', fieldName: 'language', type: 'text', hideDefaultActions: true },
    { 
        label: 'Author', fieldName: 'authorLink', type: 'url', 
        typeAttributes : { label: { fieldName : 'authorName' }, target : '_blank' }, hideDefaultActions: true 
    },
    { 
        label: 'Publish Date', fieldName: 'publishDate', type: 'date', 
        typeAttributes: { day: 'numeric', month: 'numeric', year: 'numeric' }, hideDefaultActions: true 
    }
];

export default class PublisherBooksRelatedListLwc extends LightningElement {
    @api publisherId;
    noBooksToShow = true;
    booksByPublisherRecords;
    finalBooksList;
    columns = COLUMNS;

    connectedCallback() {
        this.getRelatedBooksOnPublisher();
    }

    getRelatedBooksOnPublisher() {
        fetchBooksToShowOnPublisher({ publisherId: this.publisherId })
        .then((response) => {
            const baseUrl = 'https://'+location.host+'/';

            if ( response ) {
                //-- Update header with count --//
                this.fireUpdateHeaderEvent(response.length);

                response.forEach((book) => {
                    if (book.authorId) {
                        book.authorLink = `${baseUrl}${book.authorId}`;
                    }
                });

                this.noBooksToShow = false;
                this.booksByPublisherRecords = response;
                this.finalBooksList = response;
            }
        });
    }

    //-- Fire a custom event to update header --//
    fireUpdateHeaderEvent(responseLength) {
        const updateHeaderEvent = new CustomEvent('updateheader',{ detail: responseLength });
        this.dispatchEvent(updateHeaderEvent);
    }

    //-- Filter books when user searches for any author or genre --//
    filterBooks(event) {
        this.booksByPublisherRecords = this.finalBooksList;
        
        if (event.target.name === 'Author' || event.target.name === 'Genre') {
            const filteredBooksByAuthorOrGenre = this.finalBooksList.filter((book) => {
                return event.target.name === 'Author' ? book.authorName.toLowerCase().includes(event.detail.value) : 
                book.genre.toLowerCase().includes(event.detail.value);
            });
            this.booksByPublisherRecords = filteredBooksByAuthorOrGenre;
            this.fireUpdateHeaderEvent(filteredBooksByAuthorOrGenre.length);
        }
    }
}