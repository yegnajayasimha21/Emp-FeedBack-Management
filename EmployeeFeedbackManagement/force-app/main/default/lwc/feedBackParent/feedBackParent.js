import { LightningElement, track } from 'lwc';

export default class FeedbackParent extends LightningElement {
    @track refreshKey = 0;

    handleFeedbackSubmitted() {
        console.log('Feedback submitted, refreshing dashboard...');
        this.refreshKey++;

        const dashboard = this.template.querySelector('c-feedback-dashboard');
        if (dashboard) {
            dashboard.refreshDashboard();
        }
    }
}
