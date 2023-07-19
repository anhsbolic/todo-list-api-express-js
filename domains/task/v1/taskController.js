const taskService = require('./taskService');
const errorHelper = require('../../../libraries/error');
const logger = require('../../../libraries/logger');
const respond = require('../../../libraries/respond');

/**
 * Get List Task
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const index = async (req, res) => {
    try {
        const result = await taskService.index(req.query);
        return respond.responseSuccess(res, "Tasks retrieved successfully", result.data, result.meta);
    } catch (e) {
        logger.info(e);
        return respond.responseError(res, e.statusCode, e.message);
    }
};

/**
 * Create New Task
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const create = async (req, res) => {
    try {
        const result = await taskService.create(req.body);
        return respond.responseCreated(res, "Task created successfully", result, undefined);
    } catch (e) {
        if (e.name === errorHelper.UNPROCESSABLE_ENTITY) {
            return respond.responseUnprocessableEntity(res, e.message);
        }
        logger.info(e);
        return respond.responseError(res, e.statusCode, e.message);
    }
};

/**
 * Get Detail Task
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const detail = async (req, res) => {
    try {
        const result = await taskService.detail(req.params.id);
        return respond.responseSuccess(res, "Task retrieved successfully", result, undefined);
    } catch (e) {
        if (e.name === errorHelper.NOT_FOUND) {
            return respond.responseNotFound(res, e.message);
        }
        logger.info(e);
        return respond.responseError(res, e.statusCode, e.message);
    }
};

/**
 * Update One Task
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const updateOne = async (req, res) => {
    try {
        const result = await taskService.updateOne(req.params.id, req.body);
        return respond.responseSuccess(res, "Task updated successfully", result, undefined);
    } catch (e) {
        if (e.name === errorHelper.NOT_FOUND) {
            return respond.responseNotFound(res, e.message);
        }
        if (e.name === errorHelper.UNPROCESSABLE_ENTITY) {
            return respond.responseUnprocessableEntity(res, e.message);
        }
        logger.info(e);
        return respond.responseError(res, e.statusCode, e.message);
    }
};

/**
 * Delete One Task
 * @param {Object} req express request object
 * @param {Object} res express response object
 */
const deleteOne = async (req, res) => {
    try {
        const result = await taskService.deleteOne(req.params.id);
        return respond.responseSuccess(res, "Task deleted successfully", undefined, undefined);
    } catch (e) {
        if (e.name === errorHelper.NOT_FOUND) {
            return respond.responseNotFound(res, e.message);
        }
        if (e.name === errorHelper.UNPROCESSABLE_ENTITY) {
            return respond.responseUnprocessableEntity(res, e.message);
        }
        logger.info(e);
        return respond.responseError(res, e.statusCode, e.message);
    }
};

module.exports = {
    index,
    create,
    detail,
    updateOne,
    deleteOne,
};
