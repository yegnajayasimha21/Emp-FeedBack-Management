import { LightningElement, wire } from 'lwc';
import getFeedbackAnalytics from '@salesforce/apex/FeedbackController.getFeedbackAnalytics';
import { loadScript } from 'lightning/platformResourceLoader';
import ChartJS from '@salesforce/resourceUrl/ChartJS';

export default class FeedbackAnalytics extends LightningElement {
    chart;
    chartJsInitialized = false;
    feedbackData = [];
    ratingColors = {
        '1': 'green',
        '2': 'red',
        '3': 'yellow',
        '4': 'blue',
        '5': 'purple'
    };

    @wire(getFeedbackAnalytics)
    wiredFeedback({ data, error }) {
        if (data) {
            this.feedbackData = data;
            if (this.chartJsInitialized) {
                this.initializeChart();
            }
        } else if (error) {
            console.error('Error fetching analytics:', error);
        }
    }

    renderedCallback() {
        if (this.chartJsInitialized) return;

        Promise.all([loadScript(this, ChartJS)])
            .then(() => {
                console.log('Chart.js Loaded Successfully');
                this.chartJsInitialized = true;
                window.Chart = Chart;
                this.initializeChart();
            })
            .catch(error => {
                console.error('Error loading Chart.js', error);
            });
    }

    initializeChart() {
        if (this.chart) {
            this.chart.destroy();
        }
    
        const canvas = this.template.querySelector('.chart');
        if (!canvas) {
            console.error('Canvas element not found!');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        const labels = this.feedbackData.map(d => d.label);
        const data = this.feedbackData.map(d => d.count);
        const backgroundColors = labels.map(label => this.ratingColors[label] || 'black');
    
        this.chart = new Chart(ctx, {
            type: 'pie',
            data: { 
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        usePointStyle: true,
                        displayColors: true,
                        callbacks: {
                            label: function(tooltipItem) {
                                return `Count: ${tooltipItem.raw}`;
                            },
                            title: function(tooltipItems) {
                                return tooltipItems.length > 0 ? `Rating ${tooltipItems[0].label}` : '';
                            }
                        }
                    }
                },
                elements: {
                    arc: {
                        borderWidth: 4
                    }
                }
            }
        });
    }
    
    
    
    

    get ratingLegend() {
        return Object.entries(this.ratingColors).map(([rating, color]) => ({
            rating,
            colorClass: `legend-color ${this.getColorClass(color)}`
        }));
    }
    
    getColorClass(color) {
        switch (color) {
            case 'green': return 'legend-green';
            case 'red': return 'legend-red';
            case 'yellow': return 'legend-yellow';
            case 'blue': return 'legend-blue';
            case 'purple': return 'legend-purple';
            default: return 'legend-default';
        }
    }
}
