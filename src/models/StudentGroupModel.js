const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentGroupSchema = new Schema(
    {
        name: String,
        members: [{ type: Schema.Types.ObjectId, ref: 'Student' }], 
        courseId: { type: Schema.Types.ObjectId, ref: 'Course' }, 
        termId: { type: Schema.Types.ObjectId, ref: 'Term' }
    },
    { versionKey: false, collection: 'StudentGroups' }
);

const StudentGroup = mongoose.model('StudentGroup', studentGroupSchema, 'StudentGroups');

module.exports = StudentGroup;