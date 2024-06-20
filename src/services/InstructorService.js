const Instructor  = require("../models/InstructorModel")
const Term  = require("../models/TermModel")
const Course  = require("../models/CourseModel")
const Slot  = require("../models/SlotModel")
const StudentGroup  = require("../models/StudentGroupModel")
const Attendance  = require("../models/AttendanceModel")
const mongoose = require('mongoose');

const createInstructor = (newInstructor) => {
    return new Promise(async (resolve, reject) => {
        if (!newInstructor) {
            return reject(new TypeError("New Course data is required"));
        }

        const { name, departmentId, email, officeHours } = newInstructor

        try {
            const existingCourse = await Instructor.findOne({ name });
            if (existingCourse) {
                return resolve({
                    status: 'ERR',
                    message: 'name already exists'
                });
            }

            // Check for existing email
            const existingEmail = await Instructor.findOne({ email });
            if (existingEmail) {
                return resolve({
                    status: 'ERR',
                    message: 'Email already exists'
                });
            }

            // Cast departmentId to a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(departmentId)) {
                throw new Error("Invalid department ID format");
            }
            
            newInstructor.departmentId = new mongoose.Types.ObjectId(departmentId);

            const createdInstructor = await Instructor.create(newInstructor);

            if (createdInstructor) {
                resolve({
                    status: 'OK',
                    message: 'Instructor successfully created',
                    data: createdInstructor
                });
            }
        } catch (e) {

            reject({
                status: 'ERR',
                message: 'Error creating Instructor',
                error: e.message
            });
        }
    });
};

const updateInstructor = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkInstructor = await Instructor.findOne({
                _id:id
            })
            if (checkInstructor === null) {
                resolve({
                    status: 'OK',
                    message: 'The Instructor is not defined'
                })
            }

            const updateInstructor = await Instructor.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateInstructor
            })
        } catch (e) {
            console.log('service', e)
            reject(e)
        }
    })
}

const deleteInstructor = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkInstructor = await Instructor.findOne({
                _id:id
            })
            if (checkInstructor === null) {
                resolve({
                    status: 'OK',
                    message: 'The Instructor is not defined'
                })
            }

            await Instructor.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete Instructor success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllInstructor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allInstructor = await Instructor.find()

            resolve({
                status: 'OK',
                message: 'Success',
                data: allInstructor
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsInstructor = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const instructor = await Instructor.findOne({
                _id:id
            })
            if (instructor === null) {
                resolve({
                    status: 'OK',
                    message: 'The instructor not defined'
                })
            }


            resolve({
                status: 'OK',
                message: 'Success',
                data: instructor
            })
        } catch (e) {
            reject(e)
        }
    })
}


// const instructorSchedule = async (instructorId) => {
//     try {
//         const currentDate = new Date();
//         const instructor_id = new mongoose.Types.ObjectId(instructorId);

//         const currentTerm = await Term.findOne({
//             startDate: { $lte: currentDate },
//             endDate: { $gte: currentDate }
//         });
//         if (!currentTerm) {
//             throw new Error('No current or upcoming term found.');
//         }
//         const term_id = currentTerm._id;

//         // Fetch courses taught by the instructor for the current term
//         const courses = await Course.find({
//             instructors: instructor_id,
//             termsOffered: term_id
//         })
//         .populate('instructors', 'name')
//         .populate('departmentId', 'name');

//         if (!courses.length) {
//             return { message: 'Instructor is not teaching any courses for the current term.' };
//         }

//         const courseIds = courses.map(course => course._id);

//         // Fetch slots and student groups for these courses in the current term
//         const slots = await Slot.find({
//             courseId: { $in: courseIds },
//             termId: term_id
//         })
//         .populate('roomId')
//         .populate('courseId');

//         // Fetch student groups associated with the courses being taught by the instructor
//         const studentGroups = await StudentGroup.find({
//             courseId: { $in: courseIds },
//             termId: term_id
//         }).lean();

//         const studentGroupMap = studentGroups.reduce((map, group) => {
//             if (!map.has(group.courseId.toString())) {
//                 map.set(group.courseId.toString(), []);
//             }
//             map.get(group.courseId.toString()).push(group.name);
//             return map;
//         }, new Map());

//         const attendanceRecords = await Attendance.find({
//             instructorId: instructor_id,
//             courseId: { $in: courseIds },
//             termId: term_id
//         }).populate('studentId', '_id name');
        
//         const attendanceMap = attendanceRecords.reduce((map, record) => {
//             const key = `${record.slotId.toString()}-${record.courseId.toString()}`;
//             map.set(key, { status: record.status, date: record.date, students: [] });
//             const entry = map.get(key);
//             entry.students.push({id: record.studentId._id, name: record.studentId.name});
//             return map;
//         }, new Map());

//         const schedule = slots.map(slot => {
//             const studentGroupNames = studentGroupMap.get(slot.courseId._id.toString()) || [];
//             const studentGroupsString = studentGroupNames.join(', ');
//             const key = `${slot._id.toString()}-${slot.courseId._id.toString()}`;
//             const attendanceInfo = attendanceMap.get(key) || { status: 'Not Recorded', date: null };
            
//             return {
//                 day: slot.day,
//                 startTime: slot.startTime,
//                 endTime: slot.endTime,
//                 courseTitle: slot.courseId.title,
//                 department: slot.courseId.departmentId.name,
//                 room: slot.roomId ? `${slot.roomId.building}` : 'Room information not available',
//                 termName: currentTerm.name,
//                 students: attendanceInfo.students,
//                 studentGroup: studentGroupsString,
//                 attendanceStatus: attendanceInfo.status,
//                 attendanceDate: attendanceInfo.date ? attendanceInfo.date.toISOString().substring(0, 10) : 'Not Applicable',
//             };
//         });

//         return schedule;
//     } catch (error) {
//         console.error('Error generating schedule for instructor:', error);
//         throw error;
//     }
// };


const getPaginationInstructor = async (limit = 4, page = 0, filter) => {
    try {
        const totalInstructors = await Instructor.countDocuments()
        const queryConditions = {};
        if (filter) {
            queryConditions[filter[0]] = { '$regex': filter[1], '$options': 'i' };
        }

        const instructors = await Instructor.find(queryConditions)
            .limit(limit)
            .skip(page * limit);

        return {
            status: 'OK',
            message: 'Success',
            data: instructors,
            total: totalInstructors,
            pageCurrent: Number(page) + 1,
            totalPage: Math.ceil(totalInstructors / limit),
        };
    } catch (e) {
        console.error('Error in getPaginationStudent:', e);
        throw new Error('Failed to retrieve students');
    }
}

const instructorSchedule = async (instructorId) => {
    try {
        const currentDate = new Date();
        const instructor_id = new mongoose.Types.ObjectId(instructorId);

        // Find the current or upcoming term based on today's date
        const currentTerm = await Term.findOne({ startDate: { $lte: currentDate }, endDate: { $gte: currentDate } });
        if (!currentTerm) {
            throw new Error('No current or upcoming term found.');
        }
        const term_id = currentTerm._id;

        // Fetch courses taught by the instructor for the current term
        const courses = await Course.find({ instructors: instructor_id, termsOffered: term_id })
                                    .populate({
                                        path: 'instructors',
                                        populate: { path: 'name' }
                                    });

        if (!courses.length) {
            return { message: 'Instructor is not teaching any courses for the current term.' };
        }

        const courseIds = courses.map(course => course._id);

        // Fetch slots for these courses in the current term
        const slots = await Slot.find({ courseId: { $in: courseIds }, termId: term_id })
                                .populate('roomId')
                                .populate({
                                    path: 'courseId',
                                    populate: { path: 'instructors' },
                                });

        // Fetch student groups the instructor's courses belong to for the current term
        const studentGroups = await StudentGroup.find({ courseId: { $in: courseIds }, termId: term_id });
        const studentGroupMap = studentGroups.reduce((map, group) => {
            const courseIdStr = group.courseId.toString();
            if (map.has(courseIdStr)) {
                map.set(courseIdStr, [...map.get(courseIdStr), group.name]);
            } else {
                map.set(courseIdStr, [group.name]);
            }
            return map;
        }, new Map());

        const attendanceRecords = await Attendance.find({
            instructorId: instructor_id,
            courseId: { $in: courseIds },
            termId: term_id
        }).sort('date'); // Sort by date to ensure chronological order

        let schedule = [];

        // Create a schedule entry for each unique attendance record
        attendanceRecords.forEach(record => {
            const slot = slots.find(slot => slot._id.equals(record.slotId) && slot.courseId._id.equals(record.courseId));
            if (slot) {
                schedule.push({
                    attendanceId: record._id.toString(),
                    instructorId: instructor_id.toString(),
                    day: slot.day,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    courseTitle: slot.courseId.title,
                    instructors: slot.courseId.instructors.map(instructor => instructor.name),
                    room: slot.roomId ? slot.roomId.building : 'Room information not available',
                    termName: currentTerm.name,
                    studentGroup: studentGroupMap.get(slot.courseId._id.toString())?.join(', ') || 'No Group',
                    attendanceDate: record.date.toISOString().substring(0, 10), // format date as YYYY-MM-DD
                    attendanceStatus: record.status
                });
            }
        });

        return schedule;
    } catch (error) {
        console.error('Error generating schedule for instructor:', error);
        throw error;
    }
};



module.exports = {
    createInstructor,
    updateInstructor,
    deleteInstructor,
    getAllInstructor,
    getDetailsInstructor,
    instructorSchedule,
    getPaginationInstructor
}