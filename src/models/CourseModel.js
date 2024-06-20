const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a schema for Course
const courseSchema = new Schema(
    {
        title: String,
        description: String,
        departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
        credits: Number,
        instructors: [{ type: Schema.Types.ObjectId, ref: 'Instructor' }],
        termsOffered: [{ type: Schema.Types.ObjectId, ref: 'Term' }] ,
        totalSlots: Number
    },
    { versionKey: false, collection: 'Courses' }
);

// Create model for the course schema
const Course = mongoose.model('Course', courseSchema, 'Courses');

module.exports = Course;


