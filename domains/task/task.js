const {Schema, model, SchemaTypes: {ObjectId}} = require('mongoose');

let taskSchema = Schema(
    {
        status: {
            type: String,
            required: true,
            enum: ['active', 'completed'],
            default: 'active',
        },
        description: {
            type: String,
            required: true,
        },
    },
    {timestamps: true}
);

// index
taskSchema.index(
    {
        status: 1
    },
    {
        name: "status_index"
    }
);

// index search
taskSchema.index(
    {
        description: "text"
    },
    {
        name: "description_index",
        weights: {
            description: 2
        }
    }
);

exports.Task = model("Task", taskSchema);
