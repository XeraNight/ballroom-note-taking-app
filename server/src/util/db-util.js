const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../db.json');

const readDB = () => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            const initialData = { users: [], lineups: [] };
            fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
            return initialData;
        }
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch (error) {
        console.error('Core DB Error:', error);
        return { users: [], lineups: [] };
    }
};

const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Persistence Fail:', error);
    }
};

module.exports = { readDB, writeDB };
