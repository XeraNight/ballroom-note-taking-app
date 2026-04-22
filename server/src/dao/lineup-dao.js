const { readDB, writeDB } = require('../util/db-util');

/**
 * Lineup Data Access Object (DAO)
 * Mimics the BCAA DAO pattern for clean data separation.
 */
const lineupDao = {
    /**
     * Creates a new lineup object in the schema.
     * @param {Object} uuObject The lineup object to persist.
     */
    create(uuObject) {
        const db = readDB();
        db.lineups.push(uuObject);
        writeDB(db);
        return uuObject;
    },

    /**
     * Retrieves a lineup by ID.
     * @param {string} id The unique ID.
     */
    get(id) {
        const db = readDB();
        return db.lineups.find(l => l.id === id);
    },

    /**
     * Retrieves all lineups.
     */
    list() {
        const db = readDB();
        return db.lineups || [];
    },

    /**
     * Updates an existing lineup.
     * @param {Object} uuObject The object with updated fields.
     */
    update(uuObject) {
        const db = readDB();
        const index = db.lineups.findIndex(l => l.id === uuObject.id);
        if (index === -1) return null;

        db.lineups[index] = { ...db.lineups[index], ...uuObject, updated_at: new Date().toISOString() };
        writeDB(db);
        return db.lineups[index];
    },

    /**
     * Deletes a lineup by ID.
     * @param {string} id The ID to delete.
     */
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
