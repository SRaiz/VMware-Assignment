/*
    @Author : Sidharth Pushp
    @BuiltDate : 26th April, 2022
    @Project : VMware Assignment
    @Description : This class is to create the Transaction Log record if any Error or Exception occurs while processing !!
*/
public class TransactionLogHandler{
    
    /*
        @Author : Sidharth Pushp
        @BuildDate : 26th April, 2022
        @Description : Handles the exception related to the class by creating new transaction log record
        @Params : System.Exception ex , String processName
        @Return: void
    */
    public static void doHandleException( System.Exception ex , String processName ) {
        
        Transaction_Log__c transactionLog = new Transaction_Log__c(
            Error_Log__c = ex.getStackTraceString() + '<br/>' + ex.getMessage() + '<br/>' + ex.getCause() + ' <br/>' + ex.getTypeName(),
            Exception_Time__c = System.Now(),
            Process_Name__c = processName,
            Class_Name__c = processName
        );
        
        if ( Schema.sObjectType.Transaction_Log__c.isCreateable() ) {
            insert transactionLog;
        }
    }
}