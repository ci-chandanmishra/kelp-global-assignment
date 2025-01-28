class Database {
    // SQLite3 database 
    // initialize the db and create table if not exist
    constructor() {
        this.db = require('better-sqlite3')('database.db');
        this.db.prepare(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NULL,
            age INTEGER NULL,
            address TEXT NULL,
            additional_info TEXT NULL,
            dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP)`)
            .run();
    }

    insert(data) {
        const stmt = this.db.prepare('INSERT INTO users (name, age, address, additional_info) VALUES (@name, @age, @address, @additional_info)');
        try {
            const multiData = this.db.transaction((rowData) => {
                for (const row of rowData) stmt.run(row);
            });

            multiData(data);

            return {
                status: 'success',
                message: `${data.length} Data inserted successfully`
            };
        }
        catch (error) {
            return {
                status: 'error',
                message: error.message
            };

        }
    }

    stat() {
        return this.db.prepare(`
            SELECT
            COUNT(id) AS 'Total Count',
            ROUND(COUNT(id) * 100.0 / (SELECT COUNT(*) FROM users), 3) AS 'Distribution(%)',
            CASE 
            WHEN age < 20 THEN '< 20'
            WHEN age >= 20 AND age < 40 THEN '20-40'
            WHEN age >= 40 AND age < 60 THEN '40-60'
            ELSE '> 60'
            END AS Age_Group
            FROM users
            GROUP BY Age_Group
            `).all();
    }
}

module.exports = Database;