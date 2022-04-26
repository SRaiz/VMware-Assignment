/*
    @Author         : Sidharth Pushp
    @BuiltDate      : 26th April, 2022
    @Project        : VMware Assignment
    @Description    : This class is used for getting records for different objects.
*/
public class CustomLookUpController {
    
    /*
        @Author         : Sidharth Pushp
        @BuildDate      : 26th April, 2022
        @Description    : Return the list of records for the object on which query is required. Defaulted to id, name
        @Params         : String searchKeyWord, String objectName
        @Return         : List<sObject>
    */
    @AuraEnabled
    public static List<sObject> fetchLookUpValues( String searchKeyWord, String objectName ) {
        String fieldsToReturn = 'Id, Name';
        return CustomLookUpController.fetchCustomLookUpValues( searchKeyWord, objectName, fieldsToReturn );
    }

    /*
        @Author         : Sidharth Pushp
        @BuildDate      : 26th April, 2022
        @Description    : Return the list of records for the object on which query is required 
        @Params         : String searchKeyWord, String objectName, String fieldsToQuery
        @Return         : List<sObject>
    */
    @AuraEnabled
    public static List<sObject> fetchCustomLookUpValues( String searchKeyWord, String objectName, String fieldsToQuery ) {
        String objApiName = String.escapeSingleQuotes( objectName );
        String objFieldsToQuery = String.escapeSingleQuotes( fieldsToQuery );
        String searchKey = searchKeyWord + '%';
        
        List<sObject> returnList = new List <sObject>();
      
        String queryStr =  'SELECT '+  objFieldsToQuery +' FROM ' + objApiName + ' WHERE Name LIKE :searchKey ORDER BY CreatedDate DESC limit 5';
        
        try {
            List <sObject> sObjList = Database.query( queryStr );
            for ( sObject obj: sObjList ) {
                returnList.add( obj );
            }
        } 
        catch (Exception ex) {
            TransactionLogHandler.doHandleException( ex , 'CustomLookUpController' );
        }
        return returnList;
    }
}