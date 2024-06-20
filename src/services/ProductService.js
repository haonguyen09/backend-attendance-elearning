const Product  = require("../models/ProductModel")
const mongoose = require('mongoose');

const createProduct = async (newProduct, files) => {
    console.log("files", files);
    return new Promise(async (resolve, reject) => {
        if (!newProduct) {
            return reject(new TypeError("New Product data is required"));
        }

        const { name } = newProduct;Product

        try {
            const existingProduct = await Product.findOne({ name });
            if (existingProduct) {
                return resolve({
                    status: 'ERR',
                    message: 'Product name already exists'
                });
            }

            // Extract image and videos from the files object
            const { image, videos } = files;

            // Map videos to content items
            const updatedContent = newProduct.content.map((chapter, index) => ({
                ...chapter,
                // Assuming each chapter has items with link_video field
                items: chapter.items.map((item, itemIndex) => ({
                    ...item,
                    item_image: videos ? videos[itemIndex * 2] : null,
                    link_video: videos ? videos[itemIndex * 2 + 1] : null
                }))
            }));

            const createdProduct = await Product.create({
                ...newProduct,
                image: image ? image : null,
                content: updatedContent
            });

            if (createdProduct) {
                resolve({
                    status: 'OK',
                    message: 'Product successfully created',
                    data: createdProduct
                });
            }
        } catch (e) {
            reject({
                status: 'ERR',
                message: 'Error creating Product',
                error: e.message
            });
        }
    });
};

// const updateProduct = async (id, updatedProduct, files) => {
//     return new Promise(async (resolve, reject) => {
//         if (!updatedProduct) {
//             return reject(new TypeError("Updated Product data is required"));
//         }

//         try {
//             const existingProduct = await Product.findOne({ _id: id });
//             if (!existingProduct) {
//                 return resolve({
//                     status: 'ERR',
//                     message: 'The Product does not exist'
//                 });
//             }

//             // Extract image and videos from the files object, if available
//             const { image, videos } = files;

//             // Map videos to content items, assuming each item can have a video linked
//             const updatedContent = updatedProduct.content.map((chapter, index) => ({
//                 ...chapter,
//                 items: chapter.items.map((item, itemIndex) => ({
//                     ...item,
//                     item_image: videos && videos[itemIndex * 2] ? videos[itemIndex * 2] : item.item_image,
//                     link_video: videos && videos[itemIndex * 2 + 1] ? videos[itemIndex * 2 + 1] : item.link_video
//                 }))
//             }));

//             const updatedData = {
//                 ...updatedProduct,
//                 image: image ? image : existingProduct.image, // Use the new image if provided, else fallback to the existing one
//                 content: updatedContent
//             };

//             const updatedProductResult = await Product.findByIdAndUpdate(id, updatedData, { new: true });

//             if (updatedProductResult) {
//                 resolve({
//                     status: 'OK',
//                     message: 'Product successfully updated',
//                     data: updatedProductResult
//                 });
//             }
//         } catch (e) {
//             reject({
//                 status: 'ERR',
//                 message: 'Error updating Product',
//                 error: e.message
//             });
//         }
//     });
// };



const updateProduct = async (id, updatedProduct, files) => {
    return new Promise(async (resolve, reject) => {
        if (!updatedProduct) {
            return reject(new TypeError("Updated Product data is required"));
        }

        try {
            const existingProduct = await Product.findById(id);
            if (!existingProduct) {
                return resolve({
                    status: 'ERR',
                    message: 'Product does not exist'
                });
            }

            const { image } = files;

            const updatedContent = updatedProduct.content.map((chapter, index) => ({
                ...chapter,
                items: chapter.items.map((item, itemIndex) => {
                    const existingItem = existingProduct.content[index] && existingProduct.content[index].items[itemIndex] ? existingProduct.content[index].items[itemIndex] : {};
                    return {
                        ...item,
                        item_image: item.item_image || existingItem.item_image,
                        link_video: item.link_video || existingItem.link_video
                    };
                })
            }));

            const updatedData = {
                ...updatedProduct,
                image: image || existingProduct.image,
                content: updatedContent
            };

            const updatedProductResult = await Product.findByIdAndUpdate(id, updatedData, { new: true });
            if (updatedProductResult) {
                resolve({
                    status: 'OK',
                    message: 'Product successfully updated',
                    data: updatedProductResult
                });
            }
        } catch (e) {
            reject({
                status: 'ERR',
                message: 'Error updating product',
                error: e.message
            });
        }
    });
};









const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id:id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The Product is not defined'
                })
            }

            await Product.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete Product success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allProduct = await Product.find()

            resolve({
                status: 'OK',
                message: 'Success',
                data: allProduct
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getPaginationProduct = async (limit = 4, page = 0, filter) => {
    try {
        const totalProducts = await Product.countDocuments()
        const queryConditions = {};
        if (filter) {
            queryConditions[filter[0]] = { '$regex': filter[1], '$options': 'i' };
        }

        const products = await Product.find(queryConditions)
            .limit(limit)
            .skip(page * limit);

        return {
            status: 'OK',
            message: 'Success',
            data: products,
            total: totalProducts,
            pageCurrent: Number(page) + 1,
            totalPage: Math.ceil(totalProducts / limit),
        };
    } catch (e) {
        console.error('Error in getPaginationStudent:', e);
        throw new Error('Failed to retrieve students');
    }
}

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id:id
            })
            if (product === null) {
                resolve({
                    status: 'OK',
                    message: 'The Product not defined'
                })
            }


            resolve({
                status: 'OK',
                message: 'Success',
                data: product
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProduct,
    getDetailsProduct,
    getPaginationProduct
}