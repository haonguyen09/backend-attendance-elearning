const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a schema for Course
const termSchema  = new Schema(
    {
        name: String,
        startDate: Date,
        endDate: Date,
        departments: [{ type: Schema.Types.ObjectId, ref: 'Department' }] 
    },
    { versionKey: false, collection: 'Terms' }
);

// Create model for the course schema
const Term  = mongoose.model('Term', termSchema, 'Terms' );

module.exports = Term;