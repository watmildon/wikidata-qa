const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

function convertCsvToHtml(csvFilePath) {

    // Check if the file path is valid
    if (!fs.existsSync(csvFilePath)) {
        console.error(`The specified file ${csvFilePath} does not exist.`);
        return;
    }
    
    // Check file size
    const stats = fs.statSync(csvFilePath);
    const fileSizeInBytes = stats.size;
    console.log("File size in bytes: ", fileSizeInBytes);

    if (path.extname(csvFilePath) !== '.csv') {
        console.error("The file must have a .csv extension.");
        return;
    }
    const htmlFilePath = csvFilePath.replace('.csv', '.html');

    try {
        const data = fs.readFileSync(csvFilePath, 'utf8');

        // Parse CSV file
        Papa.parse(data, {
            header: true,
            complete: function(results) {
                const rows = results.data;
                if (rows.length === 0) {
                    console.error("No data found in the CSV file.");
                    return;
                }

                let html = '<html><body><table border="1">';

                // Generate table headers
                html += '<tr>';
                Object.keys(rows[0]).forEach(function(key) {
                    html += `<th>${key}</th>`;
                });
                html += '</tr>';

                // Generate table rows
                rows.forEach(function(row) {
                    if (Object.keys(row).length === 0) {
                        return; // Skip empty rows
                    }
                    html += '<tr>';
                    Object.values(row).forEach(function(value) {
                        // your existing value processing logic
                        html += `<td>${value}</td>`;
                    });
                    html += '</tr>';
                });

                html += '</table></body></html>';

                // Write HTML file
                try {
                    fs.writeFileSync(htmlFilePath, html);
                    console.log(`HTML file has been created at ${htmlFilePath}`);
                } catch (writeErr) {
                    console.error("Could not write file: ", writeErr);
                }
            }
        });

    } catch (err) {
        console.error("Error reading the file: ", err);
        return;
    }


}

module.exports = { convertCsvToHtml };
