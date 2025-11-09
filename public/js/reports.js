// Sales reports
const generateReportBtn = document.getElementById('generate-report');
const reportYear = document.getElementById('report-year');
const reportMonth = document.getElementById('report-month');
const reportResults = document.getElementById('report-results');

// Initialize reports
function initReports() {
    // Populate year dropdown
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        reportYear.appendChild(option);
    }
    
    generateReportBtn.addEventListener('click', generateReport);
    
    // Load default report (current month)
    const currentMonth = new Date().getMonth() + 1;
    reportMonth.value = currentMonth;
    reportYear.value = currentYear;
    generateReport();
}

// Generate report
async function generateReport() {
    const month = reportMonth.value;
    const year = reportYear.value;
    
    try {
        let url = '/api/reports/monthly';
        const params = new URLSearchParams();
        if (year) params.append('year', year);
        if (month) params.append('month', month);
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        const response = await fetch(url);
        const report = await response.json();
        
        displayReport(report);
    } catch (error) {
        console.error('Error generating report:', error);
        reportResults.innerHTML = '<p style="color: red;">Error generating report</p>';
    }
}

// Display report
function displayReport(report) {
    reportResults.innerHTML = `
        <div class="report-stats">
            <div class="stat-card">
                <h3>Period</h3>
                <div class="stat-value">${report.period}</div>
            </div>
            <div class="stat-card">
                <h3>Total Revenue</h3>
                <div class="stat-value">₹${parseFloat(report.totalRevenue).toFixed(2)}</div>
            </div>
            <div class="stat-card">
                <h3>Total Orders</h3>
                <div class="stat-value">${report.totalOrders}</div>
            </div>
            <div class="stat-card">
                <h3>Average Order Value</h3>
                <div class="stat-value">₹${parseFloat(report.averageOrderValue).toFixed(2)}</div>
            </div>
        </div>
        
        <div class="popular-items">
            <h3>Popular Items</h3>
            ${report.popularItems.length > 0 ? 
                report.popularItems.map(item => `
                    <div class="popular-item">
                        <span>${item.name}</span>
                        <span><strong>${item.quantity}</strong> sold</span>
                    </div>
                `).join('') 
                : '<p>No items sold in this period</p>'
            }
        </div>
    `;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initReports);

