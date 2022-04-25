/*
    @Author         : Sidharth Pushp
    @BuiltDate      : 22nd April, 2022
    @Project        : VMware Assignment
    @Description    : This BSO class is used get the details about all the books for a particular publishing house
*/
public class PublisherBooksDetailsClassBSO {
    
    /*
        @Author         : Sidharth Pushp
        @BuildDate      : 22nd April, 2022
        @Description    : Get all books published by the publishing house
        @Params         : String publisherId
        @Return         : List<BooksWithAuthorDetailsWrapper>
    */
    @AuraEnabled
    public static List<BooksWithAuthorDetailsWrapper> fetchBooksToShowOnPublisher( String publisherId ) {
        if ( String.isNotBlank( publisherId )) {
            
            List<BooksWithAuthorDetailsWrapper> booksAuthorDetailsWrapperList = new List<BooksWithAuthorDetailsWrapper>();
            List<BookAuthor__c> booksAuthors = PublisherBooksDetailsClassDAO.getBooksOnPublisher( publisherId );
            
            if ( booksAuthors != null && !booksAuthors.isEmpty() ) {
                for ( BookAuthor__c bookAuthor : booksAuthors ) {
                    booksAuthorDetailsWrapperList.add(
                        new BooksWithAuthorDetailsWrapper( 
                            bookAuthor.Book__r.Name , bookAuthor.Book__r.Genre__c , bookAuthor.Book__r.Language__c , 
                            bookAuthor.Book__r.PublishingDate__c, bookAuthor.Author__c , 
                            bookAuthor.Author__r.FirstName__c + ' ' + bookAuthor.Author__r.LastName__c                
                        )
                    );
                }
                return booksAuthorDetailsWrapperList;
            }
        }
        return null;
    }

    /*
        @Author         : Sidharth Pushp
        @BuildDate      : 222nd April, 2022
        @Description    : Wrapper class for sending books details along with Author details
    */
    public class BooksWithAuthorDetailsWrapper {

        @AuraEnabled public String bookName     { get; set; }
        @AuraEnabled public String genre        { get; set; }
        @AuraEnabled public String language     { get; set; }
        @AuraEnabled public Date publishDate    { get; set; }
        @AuraEnabled public String authorId     { get; set; }
        @AuraEnabled public String authorName   { get; set; }

        public BooksWithAuthorDetailsWrapper( String bookName , String genre , String language , Date publishDate , 
                                              String authorId , String authorName ) {
            this.bookName = bookName;
            this.genre = genre;
            this.language = language;
            this.publishDate = publishDate;
            this.authorId = authorId;
            this.authorName = authorName;
        }
    }
}