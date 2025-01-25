function myFunction() { // toggle sidebar
var y = document.getElementById("sidebar");
if (y.style.display === "none") {
y.style.display = "block";
} else {
y.style.display = "none";
}
}

function dashboardDropdown() { // toggle dashboard
  const dropdown = document.getElementById('dashboardDropdown'); // Target the dropdown content
  const arrow = document.getElementById('arrow'); // Target the arrow icon

  // Toggle dropdown visibility
  dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';

  // Toggle the arrow icon
  if (arrow.classList.contains('line-md--arrow-left')) {
    arrow.classList.remove('line-md--arrow-left');
    arrow.classList.add('line-md--arrow-small-down'); // Add the "up" arrow class
  } else {
    arrow.classList.remove('line-md--arrow-small-down');
    arrow.classList.add('line-md--arrow-left'); // Revert back to the "down" arrow
  }
}

function toolingDropdown() { //toggle tooling
  const dropdown = document.getElementById('toolingDropdown'); // If you have a dropdown you want to toggle
  const arrow = document.getElementById('arrow'); // Target the arrow icon
  
  // Toggle dropdown visibility (optional, depending on your needs)
  dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  
  // Toggle the arrow icon
  if (arrow.classList.contains('line-md--arrow-left')) {
    arrow.classList.remove('line-md--arrow-left');
    arrow.classList.add('line-md--arrow-small-down'); // Add the "up" arrow class
  } else {
    arrow.classList.remove('line-md--arrow-small-down');
    arrow.classList.add('line-md--arrow-left'); // Revert back to the "down" arrow
  }
}

function attendanceChart() {
    var data = google.visualization.arrayToDataTable([
      ['Department Name', 'Average'],
      ['AUTOMATION', 0.90], // Use numeric values for percentages
      ['COST CENTER', 0.00],
      ['CUSTOMS', 0.6667],
      ['EQ/FACILITY', 0.70],
      ['F & A DEPT', 0.6667],
      ['FG WAREHOUSE', 0.8095],
      ['GA DEPT',0.80],
      ['HR DEPT',0.88],
      ['IC',0.50],
      ['MAINTENANCE',0.82],
      ['MFG 2ND PROCESS',0.97],
      ['MFG MOLDING',0.98],
      ['MOLDING FACTORY',0.00],
      ['NPI',0.86],
      ['PE DEPT',1.0],
      ['PLANNING',0.77],
      ['PUR GEN',0.75],
      ['PUR MAT',0.80],
      ['QC DEPT',0.95],
      ['RM WAREHOUSE',0.94],
      ['SAFETY',0.50],
      ['SALES',0.75],
      ['SUPPORT TO KPPH',0.98],
      ['TOOLING',0.73]
    ]);
  
    var formatter = new google.visualization.NumberFormat({ pattern: '0.00%' });
    formatter.format(data, 1); // Format the second column as percentages
    
    // Prepare dynamic slice offsets based on values
    var numRows = data.getNumberOfRows();
    var slices = {};
    
    // Normalize the data to ensure the largest value gets the largest slice
    var maxValue = 0;
    for (var i = 0; i < numRows; i++) {
      var value = data.getValue(i, 1); // Get the percentage value (column 1)
      if (value > maxValue) {
        maxValue = value;
      }
    }
    
    // Adjust slice offset dynamically based on value
    for (var i = 0; i < numRows; i++) {
      var value = data.getValue(i, 1);  // Get the percentage value (column 1)
      
      // Normalize the value to create a dynamic offset based on its size
      // Larger values should have a larger offset to give them more prominence
      var offset = (value / maxValue) * 0.3;  // 0.3 is an arbitrary multiplier for larger offsets
      
      // Set the offset for this slice
      slices[i] = { offset: offset };
    }
    
    // Chart options
    var options = {
      legend: { 
        position: 'bottom',
        textStyle: { fontSize: 12 } // Adjust font size of legend
      },
      pieSliceText: 'label',  // Show labels inside slices
      title: 'Attendance by Department',
      pieStartAngle: 100,
      width: 500,    // Set the width of the chart
      height: 400,   // Set the height of the chart
      slices: slices, // Apply the dynamically calculated offsets
      chartArea: {
        left: 50,
        top: 70,
        width: '70%',
        height: '50%'
      }
    };
    
    // Create the chart
    var chart = new google.visualization.PieChart(document.getElementById('attendanceChart'));
    chart.draw(data, options);
    
}

function dtransferVisualization() {  // DAILY TRANSFER
    // Some raw data (not necessarily accurate)
    var data = google.visualization.arrayToDataTable([
      ['Month', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Rwanda', 'Average'],
      ['2004/05',  165,      938,         522,             998,           450,      614.6],
      ['2005/06',  135,      1120,        599,             1268,          288,      682],
      ['2006/07',  157,      1167,        587,             807,           397,      623],
      ['2007/08',  139,      1110,        615,             968,           215,      609.4],
      ['2008/09',  136,      691,         629,             1026,          366,      569.6]
    ]);

    var options = {
      title : 'Monthly Coffee Production by Country',
      vAxis: {title: 'Cups'},
      hAxis: {title: 'Month'},
      seriesType: 'bars',
      series: {5: {type: 'line'}}
    };

    var chart = new google.visualization.ComboChart(document.getElementById('transferChart'));
    chart.draw(data, options);
}

let currentPage = 1;
let rowsPerPage = 8; // Set the number of rows per page
let totalRows = 0; // Total number of rows in the data
let currentData = []; // Store the current data for pagination
let filteredData = [];

function createTable(data) {
  const table = document.getElementById("csvTable");
  const tableHeader = table.querySelector("thead");
  const tableBody = table.querySelector("tbody");
  const paginationControls = document.getElementById("paginationControls");

  // Clear previous table content
  tableHeader.innerHTML = '';
  tableBody.innerHTML = '';

  // Create table headers dynamically from CSV headers
  const headerRow = document.createElement("tr");
  Object.keys(data[0]).forEach(key => {
    const th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  });
  tableHeader.appendChild(headerRow);

  // Set total rows and current data
  totalRows = data.length;
  currentData = data;
  filteredData = data;

  // Display the current page of data
  displayPage(filteredData);

  // Update pagination info
  updatePaginationInfo();

  // // Show pagination controls only if there is data
  // if (totalRows > 0) {
  //   paginationControls.style.display = 'block'; // Show pagination controls
  // } else {
  //   paginationControls.style.display = 'none'; // Hide pagination controls if no data
  // }
    // Show results count and pagination controls
    document.getElementById("resultsCount").style.display = 'block'; // Show results count
    updateResultsCount(filteredData.length); // Update results count
    document.getElementById("paginationControls").style.display = 'block'; // Show pagination controls

}


function displayPage(data) {
  const tableBody = document.getElementById("csvTable").querySelector("tbody");
  tableBody.innerHTML = ''; // Clear previous rows

  // Calculate start and end indices for the current page
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  // Slice the data for the current page
  const pageData = data.slice(start, end);

  // Create table rows dynamically from the sliced data
  pageData.forEach(row => {
    const tr = document.createElement("tr");
    Object.values(row).forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });

  // If no rows exist after creating, hide pagination controls
  if (pageData.length === 0) {
    document.getElementById("paginationControls").style.display = 'none';
  }
}


function changePage(direction) {
  currentPage += direction;

  // Ensure currentPage is within bounds
  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > Math.ceil(filteredData.length / rowsPerPage)) {
    currentPage = Math.ceil(filteredData.length / rowsPerPage);
  }

  // Re-display the current page
  displayPage(filteredData); // Use the current data for pagination
  updatePaginationInfo();
}

function updatePaginationInfo() {
  const pageInfo = document.getElementById("pageInfo");
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

function searchData() {
  const input = document.getElementById('searchInput');
  const filter = input.value.toLowerCase();

  // Filter the current data based on the search input
  filteredData = currentData.filter(row => {
      return Object.values(row).some(value => 
          String(value).toLowerCase().includes(filter)
      );
  });

  // Reset to the first page and display the filtered data
  currentPage = 1;
  displayPage(filteredData);
  updatePaginationInfo();

  updateResultsCount(filteredData.length)
}
function updateResultsCount(count) {
  const resultsCountDisplay = document.getElementById("resultsCount");
  resultsCountDisplay.textContent = `Results found: ${count}`;
}