import { LightningElement, wire, track, api } from 'lwc';
import getFeedbackRecords from '@salesforce/apex/FeedbackController.getFeedbackRecords';
import { refreshApex } from '@salesforce/apex';

export default class FeedbackDashboard extends LightningElement {
    @track feedbackRecords = [];
    @track sortedBy = 'Submitted_Date__c';
    @track sortedDirection = 'desc';
    @track selectedRating = '';

    wiredFeedbackRecords;
    allFeedbackRecords = [];

    get ratingOptions() {
        return [
            { label: 'All', value: '' },
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
            { label: '5', value: '5' }
        ];
    }

    columns = [
        { label: 'Rating', fieldName: 'Rating__c', type: 'text', sortable: true },
        { label: 'Comments', fieldName: 'Comments__c', type: 'text' },
        { label: 'Email', fieldName: 'Email__c', type: 'email' },
        { label: 'Submission Date', fieldName: 'Submitted_Date__c', type: 'date', sortable: true }
    ];

    @wire(getFeedbackRecords)
    wiredFeedback(response) {
        this.wiredFeedbackRecords = response;
        if (response.data) {
            this.allFeedbackRecords = [...response.data];
            this.applyFilter();
        } else if (response.error) {
            console.error('Error fetching feedback records:', response.error);
        }
    }

    handleFilterChange(event) {
        this.selectedRating = event.target.value;
        this.applyFilter();
    }

    applyFilter() {
        if (this.selectedRating) {
            this.feedbackRecords = this.allFeedbackRecords.filter(
                record => record.Rating__c === this.selectedRating
            );
        } else {
            this.feedbackRecords = [...this.allFeedbackRecords];
        }
    }

    handleSort(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        this.sortData();
    }

    sortData() {
        let sortedRecords = [...this.feedbackRecords];
        sortedRecords.sort((a, b) => {
            let valueA = a[this.sortedBy] || '';
            let valueB = b[this.sortedBy] || '';
            return this.sortedDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        });
        this.feedbackRecords = sortedRecords;
    }

    @api
    refreshDashboard() {
        console.log('Refreshing feedback records...');
        if (this.wiredFeedbackRecords) {
            refreshApex(this.wiredFeedbackRecords).then(() => {
                if (this.wiredFeedbackRecords.data) {
                    this.allFeedbackRecords = [...this.wiredFeedbackRecords.data];
                    this.applyFilter();
                }
            });
        }
    }
}
