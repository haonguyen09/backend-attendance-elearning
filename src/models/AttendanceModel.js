const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    instructorId: { type: Schema.Types.ObjectId, ref: 'Instructor', required: true },
    slotId: { type: Schema.Types.ObjectId, ref: 'Slot', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    termId: { type: Schema.Types.ObjectId, ref: 'Term', required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent'], default: 'absent' },
    countedForPoints: { type: Boolean, required: false, default: false },
}, { versionKey: false, collection: 'Attendance' });

const Attendance = mongoose.model('Attendance', attendanceSchema, 'Attendance');

module.exports = Attendance;
