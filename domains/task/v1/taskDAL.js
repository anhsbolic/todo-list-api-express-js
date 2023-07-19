const {Task} = require('../task');
const taskConstant = require('./taskConstant');
const mongoQuery = require('../../../libraries/mongoQuery');


/**
 * Get Total Data
 * @param {Object} params
 */
const total = async (params) => {
    // init aggregate pipelines
    let pipelines = [];

    // init filters
    let filters = [];

    // filter : status
    console.log(taskConstant.TASK_STATUS_LIST.includes(params.status))
    if (params.status && taskConstant.TASK_STATUS_LIST.includes(params.status)) {
        filters.push({status: params.status});
    }

    // filter : search
    if (params.search && params.search !== "") {
        filters.push({$text: {$search: params.search}});
    }

    // filter : start_date or end_date
    if (params.start_date || params.end_date) {
        filters.push({
            'createdAt': mongoQuery.betweenDate(params.start_date, params.end_date),
        });
    }

    // assign filters to pipelines
    if (filters.length > 0) {
        pipelines.push({$match: {$and: filters}});
    }

    // count
    pipelines.push({$count: 'total'});

    // result
    let result = await Task.aggregate(pipelines);
    if (result && result.length > 0) {
        return result[0];
    }

    return {total: 0};
};

/**
 * Get List Data
 * @param {Object} params
 */
const list = async (params) => {
    // init aggregate pipelines
    let pipelines = [];

    // init filters
    let filters = [];

    // filter : status
    if (params.status && params.status !== "") {
        filters.push({status: params.status});
    }

    // filter : search
    if (params.search && params.search !== "") {
        filters.push({$text: {$search: params.search}});
    }

    // filter : start_date or end_date
    if (params.start_date || params.end_date) {
        filters.push({
            'createdAt': mongoQuery.betweenDate(params.start_date, params.end_date),
        });
    }

    // filter : search
    if (params.search && params.search !== "") {
        filters.push({$text: {$search: params.search}});
    }

    // assign filters to pipelines
    if (filters.length > 0) {
        pipelines.push({$match: {$and: filters}});
    }

    // sort
    pipelines.push({
        $sort: mongoQuery.getSort(
            params.sort_by,
            'created.at',
            params.sort_dir,
            'desc'
        ),
    });

    // pagination
    if (params.page && params.limit) {
        let pageVal = parseInt(params.page);
        let limitVal = parseInt(params.limit);
        let skip = (pageVal - 1) * limitVal;
        pipelines.push({$limit: skip + limitVal}, {$skip: skip});
    }

    // result
    return Task.aggregate(pipelines);
};

/**
 * Find By ID
 * @param {String} id
 */
const findById = async (id) => {
    return Task.findOne({_id: id}).lean();
};

/**
 * Create New Data
 * @param {Object} data
 */
const create = async (data) => {
    let task = new Task(data);
    return task.save();
};

/**
 * Update One Data with filter ID
 * @param {String} id
 * @param {Object} data
 */
const updateOne = async (id, data) => {
    return Task.findOneAndUpdate({_id: id}, data, {
        returnOriginal: false,
    });
};

/**
 * Delete One Data with filter ID
 * @param {String} id
 */
const deleteOne = async (id) => {
    return Task.deleteOne({_id: id});
};

module.exports = {
    total,
    list,
    findById,
    create,
    updateOne,
    deleteOne,
};
