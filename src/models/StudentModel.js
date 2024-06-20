const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema  = new Schema(
    {
        name: String,
        email: String,
        points: {type: Number, default: 0},
        departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
        products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
    },
    { versionKey: false, collection: 'Students' }
);

const Student  = mongoose.model('Student', studentSchema, 'Students');

module.exports = Student ;