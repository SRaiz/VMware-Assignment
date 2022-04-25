/*
    @Author         : Sidharth Pushp
    @BuiltDate      : 22nd April, 2022
    @Project        : VMware Assignment
    @Description    : This DAO class is used to provide soql results to PublisherBooksDetailsClassBSO class
*/
public class PublisherBooksDetailsClassDAO {
    
    /*
        @Author         : Sidharth Pushp
        @BuildDate      : 22nd April, 2022
        @Description    : Get all books published by the publishing house from BookAuthor junction object.
                          Getting it from juntion object will make things work in just one query.
        @Params         : String publisherId
        @Return         : List<BookAuthor__c>
    */
    public static List<BookAuthor__c> getBooksOnPublisher( String publisherId ) {
        return [
            SELECT 
                Id, Author__c, Book__c, Author__r.FirstName__c, Author__r.LastName__c, Book__r.Name, 
                Book__r.Genre__c, Book__r.Language__c, Book__r.PublishingDate__c 
            FROM BookAuthor__c 
            WHERE 
                Book__r.PublishingHouse__c =: publisherId 
            LIMIT 50000
        ];
    }
}