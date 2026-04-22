
const validationHelper = {
    
    validateDtoIn(dtoIn = {}, dtoInType = { required: [], optional: [] }) {
        const result = {
            isValid: true,
            warningMap: {},
            errorMap: {},
            dtoIn: { ...dtoIn }
        };

        const dtoInKeys = Object.keys(dtoIn);
        const allowedKeys = [...dtoInType.required, ...dtoInType.optional];

        const missingKeys = dtoInType.required.filter(key => !dtoInKeys.includes(key));
        if (missingKeys.length > 0) {
            result.isValid = false;
            result.errorMap.missingKeyMap = missingKeys.reduce((acc, key) => ({ ...acc, [key]: 'Key is missing' }), {});
        }

        const unsupportedKeys = dtoInKeys.filter(key => !allowedKeys.includes(key));
        if (unsupportedKeys.length > 0) {
            result.warningMap.unsupportedKeys = {
                unsupportedKeyList: unsupportedKeys
            };
        }

        if (!result.isValid) {
            result.errorMap.invalidTypeKeyMap = {}; 
        }

        return result;
    },

    buildErrorResponse(type, code, message, parameters = {}) {
        return {
            type,
            code,
            message,
            parameters
        };
    }
};

module.exports = validationHelper;
