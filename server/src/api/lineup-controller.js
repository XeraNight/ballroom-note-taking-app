const express = require('express');
const lineupAbl = require('../abl/lineup-abl');

const router = express.Router();

// Public Access Endpoints (Authentication removed for assignment compliance)

// List routines
router.get('/lineup/list', async (req, res) => {
    try {
        const data = await lineupAbl.listLineups();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get routine detail
router.get('/lineup/get', async (req, res) => {
    try {
        const { id } = req.query;
        const data = await lineupAbl.getLineupDetail(id);
        res.json(data);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Create routine
router.post('/lineup/create', async (req, res) => {
    try {
        const { name, dance_type, dance_name } = req.body;
        const data = await lineupAbl.createLineup(name, dance_type, dance_name);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add figure to routine
router.post('/figure/add', async (req, res) => {
    try {
        const { lineup_id, figure_name, x, y } = req.body;
        const data = await lineupAbl.addFigureToLineup(lineup_id, figure_name, x, y);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update routine figures (Infinite Stage persistence)
router.post('/figure/reorder', async (req, res) => {
    try {
        const { lineup_id, figures } = req.body;
        const data = await lineupAbl.updateLineupFigures(lineup_id, figures);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update single figure details
router.post('/figure/update', async (req, res) => {
    try {
        const { lineup_id, id, ...updates } = req.body;
        const data = await lineupAbl.updateSingleFigure(lineup_id, id, updates);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete routine
router.post('/lineup/delete', async (req, res) => {
    try {
        const { id } = req.body;
        const data = await lineupAbl.deleteLineup(id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
