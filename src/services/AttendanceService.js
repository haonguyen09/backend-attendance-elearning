const Attendance = require('../models/AttendanceModel'); // Replace with your actual path to the Attendance model
const mongoose = require('mongoose');

const createAttendance = (newAttendance) => {
    return new Promise(async (resolve, reject) => {
        if (!newAttendance) {
            return reject(new TypeError("New Attendance data is required"));
        }

        const { studentId, instructorId, slotId, courseId, termId, departmentId, date } = newAttendance;

        try {
            // const existingAttendance = await Attendance.findOne({ studentId, date });
            // if (existingAttendance) {
            //     return resolve({
            //         status: 'ERR',
            //         message: 'Date already exists'
            //     });
            // }

            // Cast studentId to a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(studentId)) {
                throw new Error("Invalid student ID format");
            }
            newAttendance.studentId = new mongoose.Types.ObjectId(studentId);

            // Cast instructorId to a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(instructorId)) {
                throw new Error("Invalid student ID format");
            }
            newAttendance.instructorId = new mongoose.Types.ObjectId(instructorId);

            // Cast slotId to a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(slotId)) {
                throw new Error("Invalid slot ID format");
            }
            newAttendance.slotId = new mongoose.Types.ObjectId(slotId);

            // Cast courseId to a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(courseId)) {
                throw new Error("Invalid course ID format");
            }
            newAttendance.courseId = new mongoose.Types.ObjectId(courseId);

            // Cast termId to a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(termId)) {
                throw new Error("Invalid term ID format");
            }
            newAttendance.termId = new mongoose.Types.ObjectId(termId);

            // Cast departmentId to a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(departmentId)) {
                throw new Error("Invalid department ID format");
            }
            newAttendance.departmentId = new mongoose.Types.ObjectId(departmentId);


            const createdAttendance = await Attendance.create(newAttendance);

            if (createdAttendance) {
                resolve({
                    status: 'OK',
                    message: 'Attendance successfully created',
                    data: createdAttendance
                });
            }
        } catch (e) {

            reject({
                status: 'ERR',
                message: 'Error creating Attendance',
                error: e.message
            });
        }
    });
};

const updateAttendance = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkAttendance = await Attendance.findOne({
                _id:id
            })
            if (checkAttendance === null) {
                resolve({
                    status: 'OK',
                    message: 'The Attendance is not defined'
                })
            }

            const updateAttendance = await Attendance.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateAttendance
            })
        } catch (e) {
            console.log('service', e)
            reject(e)
        }
    })
}

const deleteAttendance = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkAttendance = await Attendance.findOne({
                _id:id
            })
            if (checkAttendance === null) {
                resolve({
                    status: 'OK',
                    message: 'The Attendance is not defined'
                })
            }

            await Attendance.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete Attendance success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllAttendance = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allAttendance = await Attendance.find()

            resolve({
                status: 'OK',
                message: 'Success',
                data: allAttendance
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsAttendance = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const attendance = await Attendance.findOne({
                _id:id
            })
            if (attendance === null) {
                resolve({
                    status: 'OK',
                    message: 'The user not defined'
                })
            }


            resolve({
                status: 'OK',
                message: 'Success',
                data: attendance
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateMultipleAttendanceRecords = (attendanceUpdates) => {
    console.log("attendanceUpdatesService", attendanceUpdates)
    return Promise.all(attendanceUpdates.map(({ attendanceId, status }) =>
        Attendance.findOneAndUpdate(
            { _id: attendanceId },
            { $set: { status } },
            { new: true }
        ).then(updatedRecord => ({
            id: attendanceId,
            status: status,
            updatedRecord
        }))
        .catch(error => ({
            _id: attendanceId,
            error
        }))
    ));
};

const getPaginationAttendance = async (limit = 4, page = 0, filter) => {
    try {
        const totalAttendances = await Attendance.countDocuments()
        console.log("totalAttendances", totalAttendances)
        const queryConditions = {};
        if (filter) {
            queryConditions[filter[0]] = { '$regex': filter[1], '$options': 'i' };
        }

        const attendances = await Attendance.find(queryConditions)
            .limit(limit)
            .skip(page * limit);

        console.log("attendances",attendances)
        console.log("totalAttendances",totalAttendances)
        console.log("page",page)
        console.log("Number(page) + 1",Number(page) + 1)
        console.log("Math.ceil(totalAttendances / limit)", Math.ceil(totalAttendances / limit))
        
        return {
            status: 'OK',
            message: 'Success',
            data: attendances,
            total: totalAttendances,
            pageCurrent: Number(page) + 1,
            totalPage: Math.ceil(totalAttendances / limit)
        };
    } catch (e) {
        console.log(e)
        console.error('Error in getPaginationAttendance:', e);
        throw new Error('Failed to retrieve attendance');
    }
}



module.exports = {
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getAllAttendance,
    getDetailsAttendance,
    updateMultipleAttendanceRecords,
    getPaginationAttendance
}



