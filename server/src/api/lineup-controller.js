const express = require('express');
const lineupAbl = require('../abl/lineup-abl');

const router = express.Router();

const handleCommand = async (res, action, dtoIn) => {
    try {
        const dtoOut = await action(dtoIn);
        res.json(dtoOut);
    } catch (error) {
        
        if (error.code) {
            const status = error.code === 'invalidDtoIn' ? 400 : (error.code.includes('NotFound') ? 404 : 500);
            return res.status(status).json(error);
        }
        
        res.status(500).json({
            type: 'error',
            code: 'internalError',
            message: error.message,
            parameters: {}
        });
    }
};

router.get('/lineup/list', async (req, res) => {
    await handleCommand(res, lineupAbl.list.bind(lineupAbl), req.query);
});

router.get('/lineup/get', async (req, res) => {
    await handleCommand(res, lineupAbl.get.bind(lineupAbl), req.query);
});

router.post('/lineup/create', async (req, res) => {
    await handleCommand(res, lineupAbl.create.bind(lineupAbl), req.body);
});

router.post('/lineup/delete', async (req, res) => {
    await handleCommand(res, lineupAbl.delete.bind(lineupAbl), req.body);
});

router.post('/figure/add', async (req, res) => {
    await handleCommand(res, lineupAbl.addFigure.bind(lineupAbl), req.body);
});

router.post('/figure/reorder', async (req, res) => {
    await handleCommand(res, lineupAbl.updateFigures.bind(lineupAbl), req.body);
});

router.post('/figure/update', async (req, res) => {
    await handleCommand(res, lineupAbl.updateFigure.bind(lineupAbl), req.body);
});

module.exports = router;
