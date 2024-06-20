const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a schema for Course
const slotSchema    = new Schema(
    {
        startTime: String,
        endTime: String,
        day: String,
        courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
        termId: { type: Schema.Types.ObjectId, ref: 'Term' },
        roomId: { type: Schema.Types.ObjectId, ref: 'Room' }
    },
    { versionKey: false, collection: 'Slots' }
);

// Create model for the course schema
const Slot   = mongoose.model('Slot', slotSchema, 'Slots');

module.exports = Slot;