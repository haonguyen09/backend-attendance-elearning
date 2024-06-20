const Course  = require("../models/CourseModel")
const mongoose = require('mongoose');

const createCourse = (newCourse) => {
    return new Promise(async (resolve, reject) => {
        if (!newCourse) {
            return reject(new TypeError("New Course data is required"));
        }

        const { title, description, departmentId, credits, instructors, termsOffered, totalSlots } = newCourse;

        try {
            const existingCourse = await Course.findOne({ title });
            if (existingCourse) {
                return resolve({
                    status: 'ERR',
                    message: 'title already exists'
                });
            }

            // Cast departmentId to a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(departmentId)) {
                throw new Error("Invalid department ID format");
            }
            newCourse.departmentId = new mongoose.Types.ObjectId(departmentId);

            // Validate and cast each term ID in the termsOffered array to ObjectId
            if (!termsOffered.every(term => mongoose.Types.ObjectId.isValid(term))) {
                throw new Error("Invalid term ID format in termsOffered");
            }
            newCourse.termsOffered = termsOffered.map(term => new mongoose.Types.ObjectId(term));

            const createdCourse = await Course.create(newCourse);

            if (createdCourse) {
                resolve({
                    status: 'OK',
                    message: 'Course successfully created',
                    data: createdCourse
                });
            }
        } catch (e) {

            reject({
                status: 'ERR',
                message: 'Error creating course',
                error: e.message
            });
        }
    });
};

const updateCourse = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkCourse = await Course.findOne({
                _id:id
            })
            if (checkCourse === null) {
                resolve({
                    status: 'OK',
                    message: 'The course is not defined'
                })
            }

            const updateCourse = await Course.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateCourse
            })
        } catch (e) {
            console.log('service', e)
            reject(e)
        }
    })
}

const deleteCourse = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkCourse = await Course.findOne({
                _id:id
            })
            if (checkCourse === null) {
                resolve({
                    status: 'OK',
                    message: 'The course is not defined'
                })
            }

            await Course.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete course success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllCourse = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allCourse = await Course.find()

            resolve({
                status: 'OK',
                message: 'Success',
                data: allCourse
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getPaginationCourse = async (limit = 4, page = 0, filter) => {
    try {
        const totalCourses = await Course.countDocuments()
        const queryConditions = {};
        if (filter) {
            queryConditions[filter[0]] = { '$regex': filter[1], '$options': 'i' };
        }

        const courses = await Course.find(queryConditions)
            .limit(limit)
            .skip(page * limit);

        return {
            status: 'OK',
            message: 'Success',
            data: courses,
            total: totalCourses,
            pageCurrent: Number(page) + 1,
            totalPage: Math.ceil(totalCourses / limit),
        };
    } catch (e) {
        console.error('Error in getPaginationCourse:', e);
        throw new Error('Failed to retrieve Courses');
    }
}

const getDetailsCourse = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const course = await Course.findOne({
                _id:id
            })
            if (course === null) {
                resolve({
                    status: 'OK',
                    message: 'The user not defined'
                })
            }


            resolve({
                status: 'OK',
                message: 'Success',
                data: course
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createCourse,
    updateCourse,
    deleteCourse,
    getAllCourse,
    getDetailsCourse,
    getPaginationCourse
}