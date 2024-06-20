const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a schema for Course
const blockChainSchema   = new Schema(
    {
        PP: {type: Number, default: 0},
        addressWallet: {type: String, default: 0},
        LDTs: {type: Number, default: 0},
        studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true }
    },
    { versionKey: false, collection: 'BlockChains' }
);

const BlockChain = mongoose.model('BlockChain', blockChainSchema, 'BlockChains');

module.exports = BlockChain;