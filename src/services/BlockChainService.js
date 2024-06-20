const BlockChain  = require("../models/BlockChainModel")
const mongoose = require('mongoose');

const createBlockChain = (newBlockChain) => {
    return new Promise(async (resolve, reject) => {
        if (!newBlockChain) {
            return reject(new TypeError("New BlockChain data is required"));
        }

        const { PP, addressWallet, LDTs, studentId } = newBlockChain

        try {
            const existingCourse = await BlockChain.findOne({ studentId });
            if (existingCourse) {
                return resolve({
                    status: 'ERR',
                    message: 'studentId already exists'
                });
            }


            // Cast studentId to a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(studentId)) {
                throw new Error("Invalid department ID format");
            }
            
            newBlockChain.studentId = new mongoose.Types.ObjectId(studentId);

            const createdBlockChain = await BlockChain.create(newBlockChain);

            if (createdBlockChain) {
                resolve({
                    status: 'OK',
                    message: 'BlockChain successfully created',
                    data: createdBlockChain
                });
            }
        } catch (e) {

            reject({
                status: 'ERR',
                message: 'Error creating BlockChain',
                error: e.message
            });
        }
    });
};

const updateBlockChain = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkBlockChain = await BlockChain.findOne({
                _id:id
            })
            if (checkBlockChain === null) {
                resolve({
                    status: 'OK',
                    message: 'The BlockChain is not defined'
                })
            }

            const updateBlockChain = await BlockChain.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateBlockChain
            })
        } catch (e) {
            console.log('service', e)
            reject(e)
        }
    })
}

const deleteBlockChain = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkBlockChain = await BlockChain.findOne({
                _id:id
            })
            if (checkBlockChain === null) {
                resolve({
                    status: 'OK',
                    message: 'The BlockChain is not defined'
                })
            }

            await BlockChain.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete BlockChain success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllBlockChain = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allBlockChain = await BlockChain.find()

            resolve({
                status: 'OK',
                message: 'Success',
                data: allBlockChain
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsBlockChain = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const blockChain = await BlockChain.findOne({
                _id:id
            })
            if (blockChain === null) {
                resolve({
                    status: 'OK',
                    message: 'The blockChain not defined'
                })
            }


            resolve({
                status: 'OK',
                message: 'Success',
                data: blockChain
            })
        } catch (e) {
            reject(e)
        }
    })
}






module.exports = {
    createBlockChain,
    updateBlockChain,
    deleteBlockChain,
    getAllBlockChain,
    getDetailsBlockChain
}