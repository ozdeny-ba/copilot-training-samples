const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

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
