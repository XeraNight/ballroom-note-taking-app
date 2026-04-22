const { readDB, writeDB } = require('../util/db-util');

const lineupDao = {
    
    create(uuObject) {
        const db = readDB();
        db.lineups.push(uuObject);
        writeDB(db);
        return uuObject;
    },

    get(id) {
        const db = readDB();
        return db.lineups.find(l => l.id === id);
    },

    list() {
        const db = readDB();
        return db.lineups || [];
    },

    update(uuObject) {
        const db = readDB();
        const index = db.lineups.findIndex(l => l.id === uuObject.id);
        if (index === -1) return null;

        db.lineups[index] = { ...db.lineups[index], ...uuObject, updated_at: new Date().toISOString() };
        writeDB(db);
        return db.lineups[index];
    },

    remove(id) {
        const db = readDB();
        const lineup = db.lineups.find(l => l.id === id);
        if (!lineup) return false;

        db.lineups = db.lineups.filter(l => l.id !== id);
        writeDB(db);
        return true;
    }
};

module.exports = lineupDao;
