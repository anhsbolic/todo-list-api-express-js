const express = require('express');
const taskController = require('./taskController');
const taskValidation = require('./taskValidation');
const validation = require('../../../middlewares/validation');

const router = express.Router();

/**
 * Get List Task
 * @api public
 */
router.get(
    '/',
    taskController.index
);

/**
 * Create New Task
 * @api public
 */
router.post(
    '/',
    validation(taskValidation.create),
    taskController.create
);

/**
 * Get Detail Task
 * @api public
 */
router.get(
    '/:id',
    taskController.detail
);

/**
 * Update One Task
 * @api public
 */
router.put(
    '/:id',
    validation(taskValidation.updateOne),
    taskController.updateOne
);

/**
 * Delete One Task
 * @api public
 */
router.delete(
    '/:id',
    taskController.deleteOne
);

module.exports = router;
