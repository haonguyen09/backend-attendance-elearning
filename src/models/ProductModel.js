const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a schema for Course
const productSchema = new Schema(
    {
        name: String,
        image: String,
        type: String,
        price: Number,
        description: String,
        duration: Number,
        content: [
            {
                chapter: String,
                chapter_duration: Number,
                items: [
                    {
                        title: String,
                        item_duration: Number,
                        item_image: String,
                        link_video: String,
                        lock: { type: Boolean, default: false },
                        notes: [
                            {
                                note_text: String,
                                note_time: Number
                            }
                        ]
                    }
                ]
            }
        ]
    },
    { versionKey: false, collection: 'Products' }
);

// Create model for the course schema
const Product = mongoose.model('Product', productSchema, 'Products');

module.exports = Product;


