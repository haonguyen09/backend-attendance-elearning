const ProductService = require('../services/ProductService')
const Product  = require("../models/ProductModel")
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const createProduct = async (req, res) => {
    const { name, type, price, description } = req.body;
    const content = [];
    let index = 0;
    while (req.body[`content[${index}][chapter]`] !== undefined) {
        const chapterData = {
            chapter: req.body[`content[${index}][chapter]`],
            chapter_duration: parseInt(req.body[`content[${index}][chapter_duration]`]),
            items: []
        };
        let itemIndex = 0;
        while (req.body[`content[${index}][items][${itemIndex}][title]`] !== undefined) {
            const item = {
                title: req.body[`content[${index}][items][${itemIndex}][title]`],
                item_duration: parseInt(req.body[`content[${index}][items][${itemIndex}][item_duration]`]),
                item_image: req.files[`content[${index}][items][${itemIndex}][item_image]`].name
            };
            chapterData.items.push(item);
            itemIndex++;
        }
        content.push(chapterData);
        index++;
    }

    // Check for missing fields
    if (!name || !type || !price || !description || !Array.isArray(content)) {
        return res.status(400).json({
            status: 'error',
            message: 'All fields are required'
        });
    }

    try {
        // / Extract file information from the request files
        const image = req.files.image;
        const videos = req.files; // Assuming all uploaded files except the image are videos
        
        // Check if files were uploaded
        if (!image || Object.keys(videos).length === 0) {
            return res.status(400).json({ message: 'Image and videos are required' });
        }
        
        // Save image file
        const imageFileName = saveFile(image, 'image');

        // Save video files
        const videoFileNames = [];
        for (const key in videos) {
            if (key !== 'image') {
                const videoFileName = saveFile(videos[key], `video_${key}`);
                videoFileNames.push(videoFileName);
            }
        }

        // Call ProductService to create the product
        const response = await ProductService.createProduct({
            name,
            type,
            price,
            description,
            content
        }, {
            image: imageFileName,
            videos: videoFileNames
        });

        // Return response
        return res.status(200).json(response);
    } catch (e) {
        console.error('Create Product Error:', e);
        return res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: e.message
        });
    }
};

// const updateProduct = async (req, res) => {
//     const productId = req.params.id;
//     const { name, type, price, description } = req.body;
//     const content = [];
//     let index = 0;
//     while (req.body[`content[${index}][chapter]`] !== undefined) {
//         const chapterData = {
//             chapter: req.body[`content[${index}][chapter]`],
//             chapter_duration: parseInt(req.body[`content[${index}][chapter_duration]`]),
//             items: []
//         };
//         let itemIndex = 0;
//         while (req.body[`content[${index}][items][${itemIndex}][title]`] !== undefined) {
//             const item = {
//                 title: req.body[`content[${index}][items][${itemIndex}][title]`],
//                 item_duration: parseInt(req.body[`content[${index}][items][${itemIndex}][item_duration]`]),
//                 item_image: req.files[`content[${index}][items][${itemIndex}][item_image]`].name
//             };
//             chapterData.items.push(item);
//             itemIndex++;
//         }
//         content.push(chapterData);
//         index++;
//     }

//     // Check for missing fields
//     if (!name || !type || !price || !description || !Array.isArray(content)) {
//         return res.status(400).json({
//             status: 'error',
//             message: 'All fields are required'
//         });
//     }

//     try {
//         // / Extract file information from the request files
//         const image = req.files.image;
//         const videos = req.files; // Assuming all uploaded files except the image are videos
        
//         // Check if files were uploaded
//         if (!image || Object.keys(videos).length === 0) {
//             return res.status(400).json({ message: 'Image and videos are required' });
//         }
        
//         // Save image file
//         const imageFileName = saveFile(image, 'image');

//         // Save video files
//         const videoFileNames = [];
//         for (const key in videos) {
//             if (key !== 'image') {
//                 const videoFileName = saveFile(videos[key], `video_${key}`);
//                 videoFileNames.push(videoFileName);
//             }
//         }

//         // Call ProductService to create the product
//         const response = await ProductService.updateProduct(productId,{
//             name,
//             type,
//             price,
//             description,
//             content
//         }, {
//             image: imageFileName,
//             videos: videoFileNames
//         });

//         // Return response
//         return res.status(200).json(response);
//     } catch (e) {
//         console.error('Create Product Error:', e);
//         return res.status(500).json({
//             status: 'error',
//             message: 'Server error',
//             error: e.message
//         });
//     }
// };

// Function to parse content array from req.body



const updateProduct = async (req, res) => {
    const productId = req.params.id;
    const { name, type, price, description } = req.body;
    const content = [];
    let index = 0;
    while (req.body[`content[${index}][chapter]`] !== undefined) {
        const chapterData = {
            chapter: req.body[`content[${index}][chapter]`],
            chapter_duration: parseInt(req.body[`content[${index}][chapter_duration]`]),
            items: []
        };
        let itemIndex = 0;
        while (req.body[`content[${index}][items][${itemIndex}][title]`] !== undefined) {
            const itemImageFile = req.files && req.files[`content[${index}][items][${itemIndex}][item_image]`];
            const itemImage = itemImageFile ? saveFile(itemImageFile, `image_${productId}_${index}_${itemIndex}`) : undefined;
            const itemVideoFile = req.files && req.files[`content[${index}][items][${itemIndex}][link_video]`];
            const linkVideo = itemVideoFile ? saveFile(itemVideoFile, `video_${productId}_${index}_${itemIndex}`) : undefined;
            const item = {
                title: req.body[`content[${index}][items][${itemIndex}][title]`],
                item_duration: parseInt(req.body[`content[${index}][items][${itemIndex}][item_duration]`]),
                lock: (req.body[`content[${index}][items][${itemIndex}][lock]`]),
                item_image: itemImage,
                link_video: linkVideo
            };
            chapterData.items.push(item);
            itemIndex++;
        }
        content.push(chapterData);
        index++;
    }

    if (!name || !type || !price || !description || content.length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'All fields are required'
        });
    }

    try {
        const imageFile = req.files && req.files.image;
        const image = imageFile ? saveFile(imageFile, `image_${productId}`) : undefined;

        const response = await ProductService.updateProduct(productId, {
            name,
            type,
            price,
            description,
            content
        }, {
            image
        });

        return res.status(200).json(response);
    } catch (e) {
        console.error('Update Product Error:', e);
        return res.status(500).json({
            status: 'error',
            message: 'Server error',
            error: e.message
        });
    }
};








// Function to save file
const saveFile = (file, fileNamePrefix) => {
    // Extract file extension
    const extension = path.extname(file.name);

    // Generate file name with prefix and current timestamp
    const fileName = `${fileNamePrefix}_${uuidv4()}${extension}`;

    const filePath = path.join(__dirname, '../uploads/', fileName);

    // Move the file to the destination directory
    file.mv(filePath, (err) => {
        if (err) {
            throw new Error(`Error saving file ${fileName}: ${err}`);
        }
    });

    return fileName;
};






const deleteProduct = async(req, res) => {
    try {
        const ProductId = req.params.id
        // const token = req.headers
        if (!ProductId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ProductId is required'
            })
        }
        const response = await ProductService.deleteProduct(ProductId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllProduct = async(req, res) => {
    try {
        const response = await ProductService.getAllProduct()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getPaginationProduct = async(req, res) => {
    try {
        const {limit, page, filter} = req.query
        const response = await ProductService.getPaginationProduct(Number(limit), Number(page), filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


const getDetailsProduct = async (req, res) => {
    try {
        const ProductId = req.params.id
        // const token = req.headers
        if (!ProductId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ProductId is required'
            })
        }
        const response = await ProductService.getDetailsProduct(ProductId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateNotes = async (req, res) => {
    const { productId, chapterIndex, itemIndex, note } = req.body;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find the chapter and item
        const chapter = product.content[chapterIndex];
        const item = chapter.items[itemIndex];

        // Append the new note to the existing notes array
        item.notes.push(note);

        // Save the updated product
        await product.save();

        res.status(200).json({ message: 'Note added successfully' });
    } catch (error) {
        console.error('Error updating notes:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const updateLockStatus = async (req, res) => {
    const { productId, chapterIndex, itemIndex, lockStatus } = req.body;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find the chapter and item
        const chapter = product.content[chapterIndex];
        const item = chapter.items[itemIndex];

        // Update the lock status
        item.lock = lockStatus;

        // Save the updated product
        await product.save();

        res.status(200).json({ message: 'Lock status updated successfully' });
    } catch (error) {
        console.error('Error updating lock status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProduct,
    getDetailsProduct,
    getPaginationProduct,
    updateNotes,
    updateLockStatus
}