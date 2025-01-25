// Load Google Charts API
google.charts.load('current', { packages: ['corechart', 'bar'] });

// Set callback to run when Google Charts is loaded
google.charts.setOnLoadCallback(function() {
    document.getElementById("fileInput").addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            // Parse the CSV file using PapaParse
            Papa.parse(file, {
                header: true, // Use first row as headers
                skipEmptyLines: true, // Skip empty lines
                complete: function(result) {
                    console.log("Parsed Data:", result.data); // Log parsed data for debugging

                    // Count members per department
                    const departmentCounts = countMembersByDepartment(result.data);

                    // Get unique department names
                    const departments = Object.keys(departmentCounts);

                    // Generate colors for each department
                    const colors = generateColors(departments);

                    // Convert department counts to DataTable format for Google Charts
                    const data = google.visualization.arrayToDataTable([
                        ['Department', 'Members', { role: 'style' }],
                        ...departments.map((department, index) => [department, departmentCounts[department], colors[index]])
                    ]);

                    // Column chart options (swapped axis)
                    const options = {
                        title: 'Number of Members per Department',
                        chartArea: { width: '50%' },
                        vAxis: {
                            title: 'Number of Members',
                            minValue: 0
                        },
                        hAxis: {
                            title: 'Department',
                            slantedText: true, // Slants the department names
                            slantedTextAngle: 45 // Angles the text to prevent overlap
                        },
                        colors: colors,
                        legend: { position: 'bottom' },
                    };

                    // Create and draw the column chart (swapped X and Y)
                    const chart = new google.visualization.ColumnChart(document.getElementById('bar_chart'));
                    chart.draw(data, options);
                },
                error: function(error) {
                    console.error("Error parsing CSV:", error.message);
                }
            });
        }
    });
});

// Function to count members by department
function countMembersByDepartment(data) {
    const departmentCounts = {};

    // Loop through each row and count occurrences of each department
    data.forEach(row => {
        const department = row['Dept Name']; // Assuming the column is named 'Dept Name'
        if (department) {
            departmentCounts[department] = (departmentCounts[department] || 0) + 1;
        }
    });

    return departmentCounts;
}

// Function to generate a color for each department
function generateColors(departments) {
    const colors = [
        '#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02',
        '#a6761d', '#666666', '#6baed6', '#fd8d3c', '#31a354', '#636363',
        '#9e9ac8', '#fdae61', '#9e2a2e', '#56b4e9', '#f0e442', '#FF6347',
        '#FF4500', '#32CD32', '#8A2BE2', '#FF1493', '#D2691E', '#A52A2A'
    ];
    return departments.map((_, index) => colors[index % colors.length]);
}
