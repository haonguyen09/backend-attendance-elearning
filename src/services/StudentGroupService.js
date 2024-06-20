const StudentGroup  = require("../models/StudentGroupModel")
const mongoose = require('mongoose');

const createStudentGroup = (newStudentGroup) => {
    return new Promise(async (resolve, reject) => {
        if (!newStudentGroup) {
            return reject(new TypeError("New StudentGroup data is required"));
        }

        const { name, courseId, termId, members }  = newStudentGroup;

        try {
            const existingStudentGroup = await StudentGroup.findOne({ name });
            if (existingStudentGroup) {
                return resolve({
                    status: 'ERR',
                    message: 'Name already exists'
                });
            }

            // Cast courseId to a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(courseId)) {
                throw new Error("Invalid course ID format");
            }
            newStudentGroup.courseId = new mongoose.Types.ObjectId(courseId);

            // Cast termId to a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(termId)) {
                throw new Error("Invalid term ID format");
            }
            newStudentGroup.termId = new mongoose.Types.ObjectId(termId);

            // Validate and cast each term ID in the members array to ObjectId
            if (!members.every(member => mongoose.Types.ObjectId.isValid(member))) {
                throw new Error("Invalid term ID format in members");
            }
            newStudentGroup.members = members.map(member => new mongoose.Types.ObjectId(member));

            const createdStudentGroup = await StudentGroup.create(newStudentGroup);

            if (createdStudentGroup) {
                resolve({
                    status: 'OK',
                    message: 'StudentGroup successfully created',
                    data: createdStudentGroup
                });
            }
        } catch (e) {

            reject({
                status: 'ERR',
                message: 'Error creating StudentGroup',
                error: e.message
            });
        }
    });
};

const updateStudentGroup = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkStudentGroup = await StudentGroup.findOne({
                _id:id
            })
            if (checkStudentGroup === null) {
                resolve({
                    status: 'OK',
                    message: 'The StudentGroup is not defined'
                })
            }

            const updateStudentGroup = await StudentGroup.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateStudentGroup
            })
        } catch (e) {
            console.log('service', e)
            reject(e)
        }
    })
}

const deleteStudentGroup = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkStudentGroup = await StudentGroup.findOne({
                _id:id
            })
            if (checkStudentGroup === null) {
                resolve({
                    status: 'OK',
                    message: 'The StudentGroup is not defined'
                })
            }

            await StudentGroup.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete StudentGroup success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllStudentGroup = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allStudentGroup = await StudentGroup.find()

            resolve({
                status: 'OK',
                message: 'Success',
                data: allStudentGroup
            })
        } catch (e) {
            reject(e)
        }
    })
}


const getPaginationStudentGroup = async (limit = 4, page = 0, filter) => {
    try {
        const totalStudentGroups = await StudentGroup.countDocuments()
        const queryConditions = {};
        if (filter) {
            queryConditions[filter[0]] = { '$regex': filter[1], '$options': 'i' };
        }

        const studentGroups = await StudentGroup.find(queryConditions)
            .limit(limit)
            .skip(page * limit);

        return {
            status: 'OK',
            message: 'Success',
            data: studentGroups,
            total: totalStudentGroups,
            pageCurrent: Number(page) + 1,
            totalPage: Math.ceil(totalStudentGroups / limit),
        };
    } catch (e) {
        console.error('Error in getPaginationStudent:', e);
        throw new Error('Failed to retrieve students');
    }
}

const getDetailsStudentGroup = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const StudentGroupData = await StudentGroup.findOne({
                _id:id
            })
            if (StudentGroup === null) {
                resolve({
                    status: 'OK',
                    message: 'The user not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'Success',
                data: StudentGroupData
            })
        } catch (e) {
            console.log("serviece",e)
            reject(e)
        }
    })
}

module.exports = {
    createStudentGroup,
    updateStudentGroup,
    deleteStudentGroup,
    getAllStudentGroup,
    getDetailsStudentGroup,
    getPaginationStudentGroup
}