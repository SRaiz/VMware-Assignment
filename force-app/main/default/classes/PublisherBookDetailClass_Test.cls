/*
    @Author         : Sidharth Pushp
    @BuiltDate      : 24th April, 2022
    @Project        : VMware Assignment
    @Description    : This test class is used to provide testing coverage for PublisherBooksDetailsClassBSO class
*/
@isTest(seeAllData = false)
public class PublisherBookDetailClass_Test {
    
    /*
        @Author         : Sidharth Pushp
        @BuildDate      : 22nd April, 2022
        @Description    : Setup the test data for validating the PublisherBooksDetailsClassBSO class
        @Params         : none
        @Return         : none
    */
    @TestSetup
    public static void setupData() {
        // Insert 500 records for the publishing house
        List<PublishingHouse__c> pubHouseList = new List<PublishingHouse__c>();
        for ( Integer phCount = 0; phCount < 500; phCount++ ) {
            pubHouseList.add(
                new PublishingHouse__c(
                    Name                    = 'Test Publishing House ' + (phCount + 1),
                    Title__c                = 'Test Publishing House ' + (phCount + 1),
                    HeadquarterCountry__c   = 'England',
                    YearOfEstablishment__c  = String.valueOf(1842 + phCount + 1)
                )
            );
        }
        insert pubHouseList;
        
        // Insert 500 book records data
        List<Book__c> booksList = new List<Book__c>();
        List<String> booksGenre = new List<String> { 'Comedy' , 'Science Fiction' , 'Romance' , 'Novel' , 'Horror' };
        Integer bookGenreListLength = booksGenre.size();
        
        for ( Integer bookCount = 0; bookCount < 500; bookCount++ ) {
            Double randomNumber = Math.random();
            Integer randomIndex =  ( randomNumber * ( bookGenreListLength - 1 )).intValue(); 
            booksList.add(
                new Book__c(
                    Name                = 'Book ' + (bookCount + 1),
                    Genre__c            = booksGenre[randomIndex],
                    PublishingDate__c   = Date.newInstance(1910, 01, 01).addMonths(randomIndex),
                    Language__c         = 'English',
                    PublishingHouse__c  = pubHouseList[randomIndex].Id
                )
            );
        }
        insert booksList;
        
        // Insert 500 author records data
        List<Author__c> authorList = new List<Author__c>();
        for ( Integer authorCount = 0; authorCount < 500; authorCount++ ) {
            authorList.add(
                new Author__c(
                    Name                = 'Auhtor ' + (authorCount + 1),
                    FirstName__c        = 'Auhtor',
                    LastName__c         = String.valueOf(authorCount + 1),
                    CountryOfOrigin__c  = 'England',
                    Age__c              = 67
                )
            );
        }
        insert authorList;
        
        // Insert 500 Book's Author junction object records data
        List<BookAuthor__c> bookAuthorList = new List<BookAuthor__c>();
        for ( Integer baCount = 0; baCount < 500; baCount++ ) {
            bookAuthorList.add(
                new BookAuthor__c(
                    Book__c             = booksList[baCount].Id,
                    Author__c           = authorList[baCount].Id
                )
            );
        }
        insert bookAuthorList;
    }

    @IsTest
    static void fetchBooksToShowOnPublisherTest() {
        Test.startTest();

            BookAuthor__c bookAuthor = [
                SELECT 
                    Id, Author__c, Book__c, Author__r.FirstName__c, Author__r.LastName__c, Book__r.Name, 
                    Book__r.Genre__c, Book__r.Language__c, Book__r.PublishingDate__c, Book__r.PublishingHouse__c 
                FROM BookAuthor__c
                LIMIT 1
            ];
            PublisherBooksDetailsClassBSO.fetchBooksToShowOnPublisher(bookAuthor.Book__r.PublishingHouse__c);
            PublisherBooksDetailsClassBSO.fetchBooksToShowOnPublisher('');

            Book__c book = [
                SELECT
                    Id, Name, Genre__c
                FROM Book__c
                WHERE Id =: bookAuthor.Book__c 
                LIMIT 1
            ];

            // Assert for genre of book from book author
            System.assertEquals( bookAuthor.Book__r.Genre__c , book.Genre__c );

        Test.stopTest();
    }
}