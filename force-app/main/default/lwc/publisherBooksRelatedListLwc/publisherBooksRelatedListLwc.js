import { api, LightningElement } from 'lwc';
import fetchBooksToShowOnPublisher from '@salesforce/apex/PublisherBooksDetailsClassBSO.fetchBooksToShowOnPublisher';
import Show_Lookup_Component from '@salesforce/label/c.Show_Lookup_Component';

//-- Columns to show on custom related list on publisher record page --//
const COLUMNS = [
    { label: 'Name', fieldName: 'bookName', type: 'text', hideDefaultActions: true },
    { label: 'Genre', fieldName: 'genre', type: 'text', hideDefaultActions: true },
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
    showLookupCmp;
    authorOrGenreName;
    authorOrGenreBooksCount;

    connectedCallback() {
        this.showLookupCmp = ( Show_Lookup_Component === 'true' ) ? true : false;
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
            
            //-- Disable the input --//
            if (event.target.name === 'Author') {
                if (this.template.querySelector('lightning-input[data-id=genreSearch]')) {
                    if (this.template.querySelector('lightning-input[data-id=genreSearch]').disabled === false) {
                        this.template.querySelector('lightning-input[data-id=genreSearch]').disabled = true
                    }
                }
            }
            else {
                if (this.template.querySelector('lightning-input[data-id=authorSearch]')) {
                    if (this.template.querySelector('lightning-input[data-id=authorSearch]').disabled === false) {
                        this.template.querySelector('lightning-input[data-id=authorSearch]').disabled = true
                    }
                }
                //-- Update genre name to show total books genre --//
                if (filteredBooksByAuthorOrGenre.length > 0) {
                    this.authorOrGenreName = filteredBooksByAuthorOrGenre[0].genre;
                    const chosenGenreArray = filteredBooksByAuthorOrGenre.filter((book) => {
                        return book.genre === this.authorOrGenreName;
                    });
                    this.authorOrGenreBooksCount = chosenGenreArray.length;
                }
            }
            if (event.detail.value === '') {
                if (this.template.querySelector('lightning-input[data-id=authorSearch]')) {
                    this.template.querySelector('lightning-input[data-id=authorSearch]').disabled = false;
                }
                if (this.template.querySelector('lightning-input[data-id=genreSearch]')) {
                    this.template.querySelector('lightning-input[data-id=genreSearch]').disabled = false;
                }
                this.authorOrGenreName = undefined;
                this.authorOrGenreBooksCount = undefined;
            }

            //-- If no books to show then show empty table --//
            if (filteredBooksByAuthorOrGenre.length > 0) {
                this.noBooksToShow = false;
            } 
            else {
                this.noBooksToShow = true;
                this.authorOrGenreName = undefined;
                this.authorOrGenreBooksCount = undefined;
            }
        }
    }

    //-- Handle lookup selection on custom lookup --//
    handleLookupSelection(event) {
        const selectedRecord = event.detail;
        if (selectedRecord.recordId) {
            if (selectedRecord.recordId.Id) {
                //-- Disable filter by genre --//
                const ltngInput = this.template.querySelector('lightning-input[data-id=genreSearch]');
                ltngInput.disabled = true;

                //-- Update author name to show total books by him / her --//
                this.authorOrGenreName = selectedRecord.recordId.Name;

                const chosenAuthorId = selectedRecord.recordId.Id;
                const filteredBooksByAuthorLookup = this.finalBooksList.filter((book) => {
                    return chosenAuthorId === book.authorId;
                });
                this.booksByPublisherRecords = filteredBooksByAuthorLookup;
                this.fireUpdateHeaderEvent(filteredBooksByAuthorLookup.length);

                //-- If no books to show then show empty table --//
                if (filteredBooksByAuthorLookup.length > 0) {
                    this.noBooksToShow = false;
                    this.authorOrGenreBooksCount = filteredBooksByAuthorLookup.length;
                } 
                else {
                    this.noBooksToShow = true;
                }
            }
        }
        else {
            this.booksByPublisherRecords = this.finalBooksList;
            const ltngInput = this.template.querySelector('lightning-input[data-id=genreSearch]');
            ltngInput.disabled = false;
            this.authorOrGenreName = undefined
            this.authorOrGenreBooksCount = undefined;
        }
    }
}