const Department  = require("../models/DepartmentModel")
const mongoose = require('mongoose');

const createDepartment = (newDepartment) => {
    return new Promise(async (resolve, reject) => {
        if (!newDepartment) {
            return reject(new TypeError("New Course data is required"));
        }

        const { name } = newDepartment

        try {
            const existingCourse = await Department.findOne({ name });
            if (existingCourse) {
                return resolve({
                    status: 'ERR',
                    message: 'name already exists'
                });
            }

            // Validate and cast each term ID in the termsOffered array to ObjectId
            // if (!coursesOffered.every(term => mongoose.Types.ObjectId.isValid(term))) {
            //     throw new Error("Invalid term ID format in coursesOffered");
            // }
            // newDepartment.coursesOffered = coursesOffered.map(term => new mongoose.Types.ObjectId(term));

            const createdDepartment = await Department.create(newDepartment);

            if (createdDepartment) {
                resolve({
                    status: 'OK',
                    message: 'Department successfully created',
                    data: createdDepartment
                });
            }
        } catch (e) {

            reject({
                status: 'ERR',
                message: 'Error creating Department',
                error: e.message
            });
        }
    });
};

const updateDepartment = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkDepartment = await Department.findOne({
                _id:id
            })
            if (checkDepartment === null) {
                resolve({
                    status: 'OK',
                    message: 'The Department is not defined'
                })
            }

            const updateDepartment = await Department.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateDepartment
            })
        } catch (e) {
            console.log('service', e)
            reject(e)
        }
    })
}

const deleteDepartment = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkDepartment = await Department.findOne({
                _id:id
            })
            if (checkDepartment === null) {
                resolve({
                    status: 'OK',
                    message: 'The Department is not defined'
                })
            }

            await Department.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete department success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllDepartment = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allDepartment = await Department.find()

            resolve({
                status: 'OK',
                message: 'Success',
                data: allDepartment
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getPaginationDepartment = async (limit = 4, page = 0, filter) => {
    try {
        const totalDepartment = await Department.countDocuments()
        const queryConditions = {};
        if (filter) {
            queryConditions[filter[0]] = { '$regex': filter[1], '$options': 'i' };
        }

        const departments = await Department.find(queryConditions)
            .limit(limit)
            .skip(page * limit);

        return {
            status: 'OK',
            message: 'Success',
            data: departments,
            total: totalDepartment,
            pageCurrent: Number(page) + 1,
            totalPage: Math.ceil(totalDepartment / limit),
        };
    } catch (e) {
        console.error('Error in getPaginationDepartment:', e);
        throw new Error('Failed to retrieve Departments');
    }
}

const getDetailsDepartment = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const department = await Department.findOne({
                _id:id
            })
            if (department === null) {
                resolve({
                    status: 'OK',
                    message: 'The department not defined'
                })
            }


            resolve({
                status: 'OK',
                message: 'Success',
                data: department
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getAllDepartment,
    getDetailsDepartment,
    getPaginationDepartment
}