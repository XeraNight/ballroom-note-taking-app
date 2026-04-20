const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../util/db-util');

// --- LINEUP LOGIC ---

async function listLineups() {
    const db = readDB();
    // Public Access: Return all lineups
    return db.lineups;
}

async function getLineupDetail(lineupId) {
    const db = readDB();
    const lineup = db.lineups.find(l => l.id === lineupId);
    if (!lineup) throw new Error('Lineup not found');
    return lineup;
}

async function createLineup(name, danceType, danceName) {
    const db = readDB();
    const newLineup = {
        id: uuidv4(),
        name,
        dance_type: danceType,
        dance_name: danceName,
        figures: [], // Embedded Figures (Nested Entity Approach)
        created_at: new Date().toISOString()
    };
    db.lineups.push(newLineup);
    writeDB(db);
    return newLineup;
}

// --- FIGURE LOGIC (Nested inside Lineups) ---

async function addFigureToLineup(lineupId, figureName, x = 100, y = 100) {
    const db = readDB();
    const lineupIndex = db.lineups.findIndex(l => l.id === lineupId);
    if (lineupIndex === -1) throw new Error('Lineup not found');

    const newFigure = {
        id: uuidv4(),
        figure_name: figureName,
        x,
        y,
        duration: 8, // Default 8 seconds per figure
        notes: '',
        video_urls: [],
        image_urls: [],
        created_at: new Date().toISOString()
    };

    db.lineups[lineupIndex].figures.push(newFigure);
    writeDB(db);
    return newFigure;
}

async function updateLineupFigures(lineupId, figures) {
    const db = readDB();
    const lineupIndex = db.lineups.findIndex(l => l.id === lineupId);
    if (lineupIndex === -1) throw new Error('Lineup not found');

    // Bulk update of the nested entity
    db.lineups[lineupIndex].figures = figures;
    db.lineups[lineupIndex].updated_at = new Date().toISOString();
    
    writeDB(db);
    return { success: true };
}

async function updateSingleFigure(lineupId, figureId, updates) {
    const db = readDB();
    const lineupIndex = db.lineups.findIndex(l => l.id === lineupId);
    if (lineupIndex === -1) throw new Error('Lineup not found');

    const figureIndex = db.lineups[lineupIndex].figures.findIndex(f => f.id === figureId);
    if (figureIndex === -1) throw new Error('Figure not found');

    db.lineups[lineupIndex].figures[figureIndex] = {
        ...db.lineups[lineupIndex].figures[figureIndex],
        ...updates,
        updated_at: new Date().toISOString()
    };

    writeDB(db);
    return db.lineups[lineupIndex].figures[figureIndex];
}

async function deleteLineup(lineupId) {
    const db = readDB();
    db.lineups = db.lineups.filter(l => l.id !== lineupId);
    writeDB(db);
    return { success: true };
}

module.exports = {
    listLineups,
    getLineupDetail,
    createLineup,
    addFigureToLineup,
    updateLineupFigures,
    updateSingleFigure,
    deleteLineup
};
