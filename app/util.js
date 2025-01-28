class Util {
    csv2json(csvString) {
        // Split the CSV string into rows
        csvString = csvString.replace(/,\s+/g, ","); // Remove space after comma for preventing the space in keys
        // console.log(csvString);
        const rows = csvString.trim().split("\n");
        // Extracting the headers as first row
        const headers = rows[0].split(",");

        // removing the first row from the rows array
        const dataRows = rows.slice(1);

        // Map rows to JSON objects
        const jsonArray = dataRows.map(row => {
            const values = row.split(",");
            const jsonObject = {};

            headers.forEach((header, index) => {
                const keys = header.split(".");  // dot notation into nested keys
                keys.reduce((acc, key, keyIndex) => {
                    key = key.replace(/"/g, "").trim(); // Remove quotes from key
                    if (keyIndex === keys.length - 1) {
                        acc[key] = values[index].trim(); // Assignment of value at the last key
                    } else {
                        acc[key] = acc[key] || {}; // Creating an object if it doesn't exist
                    }
                    return acc[key];
                }, jsonObject);
            });

            return jsonObject;
        });

        return jsonArray;
    }

}

module.exports = Util;