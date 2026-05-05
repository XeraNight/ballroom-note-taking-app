const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const lineupDao = require('../dao/lineup-dao');
const validationHelper = require('../util/validation-helper');

const LineupAbl = {

    _deletePhysicalFiles(figures) {
        if (!figures || !Array.isArray(figures)) return;
        figures.forEach(fig => {
            const files = [...(fig.video_urls || []), ...(fig.image_urls || [])];
            files.forEach(url => {
                if (typeof url !== 'string' || !url.includes('/uploads/')) return;
                try {
                    const filename = url.split('/').pop();
                    const filePath = path.join(__dirname, '../../uploads', filename);
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                } catch (err) {
                    console.error('Persistence cleanup error:', err);
                }
            });
        });
    },

    async list(dtoIn) {
        
        const dtoInType = { required: [], optional: [] };
        const validationResult = validationHelper.validateDtoIn(dtoIn, dtoInType);

        const lineups = lineupDao.list();

        return lineups;
    },

    async get(dtoIn) {
        
        const dtoInType = { required: ['id'], optional: [] };
        const validationResult = validationHelper.validateDtoIn(dtoIn, dtoInType);
        if (!validationResult.isValid) {
            throw validationHelper.buildErrorResponse('error', 'invalidDtoIn', 'DtoIn is not valid.', validationResult.errorMap);
        }

        const lineup = lineupDao.get(dtoIn.id);
        if (!lineup) {
            throw validationHelper.buildErrorResponse('error', 'lineupNotFound', `Lineup ${dtoIn.id} was not found.`);
        }

        return {
            ...lineup,
            uuAppErrorMap: validationResult.warningMap
        };
    },

    async create(dtoIn) {
        
        const dtoInType = { required: ['name', 'dance_type', 'dance_name'], optional: [] };
        const validationResult = validationHelper.validateDtoIn(dtoIn, dtoInType);
        if (!validationResult.isValid) {
            throw validationHelper.buildErrorResponse('error', 'invalidDtoIn', 'DtoIn is not valid.', validationResult.errorMap);
        }

        const newLineup = {
            id: uuidv4(),
            name: dtoIn.name,
            dance_type: dtoIn.dance_type,
            dance_name: dtoIn.dance_name,
            figures: [],
            created_at: new Date().toISOString()
        };
        
        const result = lineupDao.create(newLineup);

        return {
            ...result,
            uuAppErrorMap: validationResult.warningMap
        };
    },

    async addFigure(dtoIn) {
        
        const dtoInType = { required: ['lineup_id', 'figure_name'], optional: ['x', 'y'] };
        const validationResult = validationHelper.validateDtoIn(dtoIn, dtoInType);
        if (!validationResult.isValid) {
            throw validationHelper.buildErrorResponse('error', 'invalidDtoIn', 'DtoIn is not valid.', validationResult.errorMap);
        }

        const lineup = lineupDao.get(dtoIn.lineup_id);
        if (!lineup) throw validationHelper.buildErrorResponse('error', 'lineupNotFound', 'Lineup not found.');

        const newFigure = {
            id: uuidv4(),
            figure_name: dtoIn.figure_name,
            x: dtoIn.x || 100,
            y: dtoIn.y || 100,
            duration: 8,
            notes: '',
            video_urls: [],
            image_urls: [],
            created_at: new Date().toISOString()
        };

        lineup.figures.push(newFigure);
        lineupDao.update(lineup);

        return {
            ...newFigure,
            uuAppErrorMap: validationResult.warningMap
        };
    },

    async updateFigures(dtoIn) {
        
        const dtoInType = { required: ['lineup_id', 'figures'], optional: [] };
        const validationResult = validationHelper.validateDtoIn(dtoIn, dtoInType);
        if (!validationResult.isValid) {
            throw validationHelper.buildErrorResponse('error', 'invalidDtoIn', 'DtoIn is not valid.', validationResult.errorMap);
        }

        const lineup = lineupDao.get(dtoIn.lineup_id);
        if (!lineup) throw validationHelper.buildErrorResponse('error', 'lineupNotFound', 'Lineup not found.');

        const oldFigures = lineup.figures || [];
        const deletedFigures = oldFigures.filter(oldF => !dtoIn.figures.some(newF => newF.id === oldF.id));
        this._deletePhysicalFiles(deletedFigures);

        lineup.figures = dtoIn.figures;
        lineupDao.update(lineup);

        return {
            success: true,
            uuAppErrorMap: validationResult.warningMap
        };
    },

    async updateFigure(dtoIn) {
        
        const dtoInType = { required: ['lineup_id', 'id'], optional: ['figure_name', 'notes', 'duration', 'video_urls', 'image_urls', 'x', 'y'] };
        const validationResult = validationHelper.validateDtoIn(dtoIn, dtoInType);
        if (!validationResult.isValid) {
            throw validationHelper.buildErrorResponse('error', 'invalidDtoIn', 'DtoIn is not valid.', validationResult.errorMap);
        }

        const lineup = lineupDao.get(dtoIn.lineup_id);
        if (!lineup) throw validationHelper.buildErrorResponse('error', 'lineupNotFound', 'Lineup not found.');

        const figureIndex = lineup.figures.findIndex(f => f.id === dtoIn.id);
        if (figureIndex === -1) throw validationHelper.buildErrorResponse('error', 'figureNotFound', 'Figure not found.');

        const oldFigure = lineup.figures[figureIndex];

        if (dtoIn.video_urls || dtoIn.image_urls) {
            const oldFiles = [...(oldFigure.video_urls || []), ...(oldFigure.image_urls || [])];
            const newFiles = [...(dtoIn.video_urls || []), ...(dtoIn.image_urls || [])];
            const orphanedFiles = oldFiles.filter(oldUrl => !newFiles.includes(oldUrl));
            this._deletePhysicalFiles([{ video_urls: orphanedFiles.filter(u => u.includes('.mp4')), image_urls: orphanedFiles.filter(u => !u.includes('.mp4')) }]);
        }

        lineup.figures[figureIndex] = {
            ...lineup.figures[figureIndex],
            ...dtoIn,
            updated_at: new Date().toISOString()
        };

        lineupDao.update(lineup);

        return {
            ...lineup.figures[figureIndex],
            uuAppErrorMap: validationResult.warningMap
        };
    },

    async delete(dtoIn) {
        
        const dtoInType = { required: ['id'], optional: [] };
        const validationResult = validationHelper.validateDtoIn(dtoIn, dtoInType);
        if (!validationResult.isValid) {
            throw validationHelper.buildErrorResponse('error', 'invalidDtoIn', 'DtoIn is not valid.', validationResult.errorMap);
        }

        const lineup = lineupDao.get(dtoIn.id);
        if (lineup) {
            this._deletePhysicalFiles(lineup.figures);
            lineupDao.remove(dtoIn.id);
        }

        return {
            success: true,
            uuAppErrorMap: validationResult.warningMap
        };
    }
};

module.exports = LineupAbl;
