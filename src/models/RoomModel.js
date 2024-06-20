const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a schema for Course
const roomSchema   = new Schema(
    {
        building: String,
        capacity: Number,
        features: [String],
        // availability: [{
        //     _id: false,
        //     termId: { type: Schema.Types.ObjectId, ref: 'Term' }, // Reference to the Term schema
        //     // slotId: { type: Schema.Types.ObjectId, ref: 'Slot' }, // Reference to the Slot schema
        //     occupied: Boolean
        // }]  
    },
    { versionKey: false, collection: 'Rooms' }
);

const Room = mongoose.model('Room', roomSchema, 'Rooms');

module.exports = Room;