const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const USERNAME_PATTERN = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{5,}$/;

document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const feedback = document.getElementById('username-feedback');

    function validateUsername() {
        const valid = USERNAME_PATTERN.test(usernameInput.value);
        usernameInput.classList.toggle('is-invalid', !valid);
        usernameInput.classList.toggle('is-valid', valid);
        feedback.classList.toggle('d-none', valid);
    }

    const successMsg = document.getElementById('username-success');

    function showResult(valid) {
        feedback.classList.toggle('d-none', valid);
        successMsg.classList.toggle('d-none', !valid);
        if (valid) {
            successMsg.textContent = `Username "${usernameInput.value}" accepted! Welcome.`;
        }
    }

    usernameInput.addEventListener('input', () => {
        validateUsername();
        // Hide result messages while the user is still typing
        successMsg.classList.add('d-none');
    });
    usernameInput.addEventListener('blur', validateUsername);

    document.getElementById('username-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const valid = USERNAME_PATTERN.test(usernameInput.value);
        validateUsername();
        showResult(valid);
    });
});

let budgetChart = null;

function getChartData() {
    const incomes = MONTH_KEYS.map(key => {
        const val = parseFloat(document.getElementById(`income-${key}`).value);
        return isNaN(val) ? 0 : val;
    });
    const expenses = MONTH_KEYS.map(key => {
        const val = parseFloat(document.getElementById(`expense-${key}`).value);
        return isNaN(val) ? 0 : val;
    });
    return { incomes, expenses };
}

function renderChart(incomes, expenses) {
    const ctx = document.getElementById('budgetChart').getContext('2d');

    if (budgetChart) {
        budgetChart.destroy();
    }

    budgetChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: MONTHS,
            datasets: [
                {
                    label: 'Income (£)',
                    data: incomes,
                    backgroundColor: 'rgba(40, 167, 69, 0.75)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Expenses (£)',
                    data: expenses,
                    backgroundColor: 'rgba(220, 53, 69, 0.75)',
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: {
                    display: true,
                    text: 'Monthly Income vs Expenses'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => '£' + value.toLocaleString()
                    }
                }
            }
        }
    });
}

document.getElementById('updateChartBtn').addEventListener('click', () => {
    const { incomes, expenses } = getChartData();
    renderChart(incomes, expenses);

    // Switch to the Chart tab
    const chartTab = document.getElementById('chart-tab');
    bootstrap.Tab.getOrCreateInstance(chartTab).show();
});

document.getElementById('downloadChartBtn').addEventListener('click', () => {
    if (!budgetChart) {
        alert('Please generate the chart first by clicking "Update Chart".');
        return;
    }

    const imageUrl = budgetChart.toBase64Image('image/png', 1);
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'bucks2bar-chart.png';
    link.click();
});

// Export for testing (Node.js / Jest)
if (typeof module !== 'undefined') {
    module.exports = { USERNAME_PATTERN, MONTH_KEYS, MONTHS, getChartData };
}
