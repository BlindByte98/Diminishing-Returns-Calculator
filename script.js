let myChart; // Declare a global variable for the chart instance

document.getElementById('data-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get values from the form
    const xAxisName = document.getElementById('x-axis-name').value;
    const yAxisName = document.getElementById('y-axis-name').value;
    const xValues = document.getElementById('x-values').value.split(',').map(Number);
    const yValues = document.getElementById('y-values').value.split(',').map(Number);

    // Basic validation
    if (xValues.length !== yValues.length || xValues.length < 2) {
        alert('Please ensure X and Y values have the same number of elements and at least two values.');
        return;
    }

    // Destroy the existing chart instance if it exists
    if (myChart) {
        myChart.destroy();
    }

    // Create the chart
    const ctx = document.getElementById('myChart').getContext('2d');
    const effectivePoint = calculateEffectivePoint(xValues, yValues);

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: yAxisName,
                data: yValues,
                borderColor: 'rgba(0, 123, 255, 1)',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                fill: true,
                pointBackgroundColor: function(context) {
                    // Highlight the most effective point
                    if (context.dataIndex === xValues.indexOf(effectivePoint.x)) {
                        return 'rgba(255, 99, 132, 1)'; // Highlight color
                    }
                    return 'rgba(75, 192, 192, 1)'; // Default color
                },
                pointBorderColor: function(context) {
                    // Highlight the most effective point
                    if (context.dataIndex === xValues.indexOf(effectivePoint.x)) {
                        return 'rgba(255, 99, 132, 1)'; // Highlight border color
                    }
                    return 'rgba(75, 192, 192, 1)'; // Default border color
                },
                pointRadius: function(context) {
                    // Increase radius for the most effective point
                    if (context.dataIndex === xValues.indexOf(effectivePoint.x)) {
                        return 8; // Larger radius for the effective point
                    }
                    return 5; // Default radius
                },
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: xAxisName,
                        color: '#e0e0e0' // Light x-axis text
                    },
                    ticks: {
                        color: '#e0e0e0' // Light x-axis text
                    },
                    grid: {
                        color: '#333' // Dark x-axis grid lines
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: yAxisName,
                        color: '#e0e0e0' // Light y-axis text
                    },
                    ticks: {
                        color: '#e0e0e0' // Light y-axis text
                    },
                    grid: {
                        color: '#333' // Dark y-axis grid lines
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `${xAxisName}: ${tooltipItems[0].label}, ${yAxisName}: ${tooltipItems[0].formattedValue}`;
                        }
                    }
                }
            }
        }
    });

    // Display the result
    document.getElementById('result').innerText = `Most Effective Point: ${xAxisName} = ${effectivePoint.x}, ${yAxisName} = ${effectivePoint.y}`;
});

function calculateEffectivePoint(xValues, yValues) {
    let maxDifference = -Infinity;
    let bestIndex = 0;

    for (let i = 1; i < yValues.length - 1; i++) {
        const prevDiff = yValues[i] - yValues[i - 1];
        const nextDiff = yValues[i + 1] - yValues[i];
        const difference = prevDiff - nextDiff;

        if (difference > maxDifference) {
            maxDifference = difference;
            bestIndex = i;
        }
    }

    return {
        x: xValues[bestIndex],
        y: yValues[bestIndex]
    };
}
