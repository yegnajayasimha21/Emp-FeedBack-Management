import { LightningElement, track } from 'lwc';
import submitFeedback from '@salesforce/apex/FeedbackController.submitFeedback';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FeedbackForm extends LightningElement {
    @track rating = '';
    @track comments = '';
    @track email = '';
    @track submittedDate = '';
    @track address = '';
    @track phone = '';
    @track domain = '';

    get ratingOptions() {
        return [
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
            { label: '5', value: '5' }
        ];
    }

    get domainOptions() {
        return [
            { label: 'Developer', value: 'Developer' },
            { label: 'Tester', value: 'Tester' },
            { label: 'Analyst', value: 'Analyst' },
            { label: 'Support Team', value: 'Support Team' },
        ];
    }

    handleChange(event) {
        this[event.target.dataset.field] = event.target.value;
    }

    handleSubmit() {
        submitFeedback({
            rating: this.rating,
            comments: this.comments,
            email: this.email,
            submittedDate: this.submittedDate,
            address: this.address,
            phone: this.phone,
            domain: this.domain
        })
        .then(() => {
            this.showToast('Success', 'Feedback submitted successfully!', 'success');
            this.clearForm();
            
            const event = new CustomEvent('feedbacksubmitted', {
                bubbles: true,
                composed: true
            });
            this.dispatchEvent(event);
        })
        .catch(error => {
            console.error('Error:', error);
            this.showToast('Error', error.body.message, 'error');
        });
    }
    
    clearForm() {
        this.rating = '';
        this.comments = '';
        this.email = '';
        this.submittedDate = '';
        this.address = '';
        this.phone = '';
        this.domain = '';
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
