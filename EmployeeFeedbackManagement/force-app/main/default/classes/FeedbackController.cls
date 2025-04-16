public with sharing class FeedbackController {
    @AuraEnabled
    public static void submitFeedback(String rating, String comments, String email, String submittedDate, String address, String phone, String domain) {
        try {
            System.debug('Received Data - Rating: ' + rating + ', Comments: ' + comments + ', Email: ' + email + 
                         ', Submitted Date: ' + submittedDate + ', Address: ' + address + ', Phone: ' + phone + ', Domain: ' + domain);
            
            Date formattedDate;
            try {
                formattedDate = Date.valueOf(submittedDate);
            } catch (Exception e) {
                formattedDate = DateTime.valueOf(submittedDate).date();
            }

            Emp_FeedBack_Mang__c newFeedback = new Emp_FeedBack_Mang__c(
                Rating__c = rating, 
                Comments__c = comments,
                Email__c = email,
                Submitted_Date__c = formattedDate,
                Address__c = address,
                Phone_Number__c = phone,
                Domain__c = domain
            );

            insert newFeedback;
            System.debug('Record Inserted Successfully: ' + newFeedback.Id);
        } catch (Exception e) {
            System.debug('Error inserting record: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Emp_FeedBack_Mang__c> getFeedbackRecords() {
        return [SELECT Id, Rating__c, Comments__c, Email__c, Submitted_Date__c FROM Emp_FeedBack_Mang__c ORDER BY Submitted_Date__c DESC];
    }

    @AuraEnabled(cacheable=true)
    public static List<FeedbackAnalyticsData> getFeedbackAnalytics() {
        List<AggregateResult> results = [SELECT Rating__c Rating, COUNT(Id) Total FROM Emp_FeedBack_Mang__c GROUP BY Rating__c];

        List<FeedbackAnalyticsData> analyticsData = new List<FeedbackAnalyticsData>();
        for (AggregateResult ar : results) {
            FeedbackAnalyticsData data = new FeedbackAnalyticsData();
            data.label = String.valueOf(ar.get('Rating'));
            data.count = Integer.valueOf(ar.get('Total'));
            analyticsData.add(data);
        }
        return analyticsData;
    }
}
