const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a schema for Course
const instructorSchema    = new Schema(
    {
        instructorId: String,
        name: String,
        departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
        email: String,
        officeHours: String
    },
    { versionKey: false, collection: 'Instructors' }
);

// Create model for the course schema
const Instructor = mongoose.model('Instructor', instructorSchema, 'Instructors');

module.exports = Instructor;