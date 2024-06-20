const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a schema for Course
const departmentSchema   = new Schema(
    {
        name: String,
        coursesOffered: [{ type: Schema.Types.ObjectId, ref: 'Course' }] 
    },
    { versionKey: false, collection: 'Departments' }
);

// Create model for the course schema
const Department = mongoose.model('Department', departmentSchema, 'Departments');

module.exports = Department;