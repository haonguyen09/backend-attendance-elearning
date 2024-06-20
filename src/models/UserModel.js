const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema   = new Schema(
    {
        username: String,
        password: String, // Should be hashed
        role: String,
        access_token: String,
        refresh_token: String,
        details: {
            name: String,
            email: String
        }
    },
    { versionKey: false, collection: 'Users' }
);

const User  = mongoose.model('User', userSchema, 'Users' );

module.exports = User;