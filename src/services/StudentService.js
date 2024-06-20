const Student  = require("../models/StudentModel")
const StudentGroup  = require("../models/StudentGroupModel")
const Slot  = require("../models/SlotModel")
const Attendance  = require("../models/AttendanceModel")
const Term  = require("../models/TermModel")


const mongoose = require('mongoose');

const createStudent = (newStudent) => {
    return new Promise(async (resolve, reject) => {
        if (!newStudent) {
            return reject(new TypeError("New Course data is required"));
        }

        const { name, email, departmentId, enrolledCourses } = newStudent

        try {
            const existingStudent = await Student.findOne({ name });
            if (existingStudent) {
                return resolve({
                    status: 'ERR',
                    message: 'Name already exists'
                });
            }

            const existingEmail = await Student.findOne({ email });
            if (existingEmail) {
                return resolve({
                    status: 'ERR',
                    message: 'Email already exists'
                });
            }

            // Validate and cast each term ID in the termsOffered array to ObjectId
            if (!enrolledCourses.every(course => mongoose.Types.ObjectId.isValid(course))) {
                throw new Error("Invalid course ID format in coursesOffered");
            }
            newStudent.enrolledCourses = enrolledCourses.map(course => new mongoose.Types.ObjectId(course));

            const createdStudent = await Student.create(newStudent);

            if (createdStudent) {
                resolve({
                    status: 'OK',
                    message: 'Student successfully created',
                    data: createdStudent
                });
            }
        } catch (e) {

            reject({
                status: 'ERR',
                message: 'Error creating Student',
                error: e.message
            });
        }
    });
};

const updateStudent = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkStudent = await Student.findOne({
                id:id
            })
            if (checkStudent !== null) {
                resolve({
                    status: 'OK',
                    message: 'The Student is already'
                })
            }

            const updateStudent = await Student.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateStudent
            })
        } catch (e) {
            console.log('service', e)
            reject(e)
        }
    })
}

const updateAttendance = (id, attendance) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkStudent = await Student.findOne({
                _id:id
            })
            if (checkStudent === null) {
                resolve({
                    status: 'OK',
                    message: 'The Student is not defined'
                })
            }

            const updateStudent = await Student.findByIdAndUpdate(id, attendance, { new: true })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateStudent
            })
        } catch (e) {
            console.log('service', e)
            reject(e)
        }
    })
}


const deleteStudent = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkStudent = await Student.findOne({
                _id:id
            })
            if (checkStudent === null) {
                resolve({
                    status: 'OK',
                    message: 'The Student is not defined'
                })
            }

            await Student.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete Student success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllStudent = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allStudent = await Student.find()

            resolve({
                status: 'OK',
                message: 'Success',
                data: allStudent
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getPaginationStudent = async (limit = 4, page = 0, filter) => {
    try {
        const totalStudents = await Student.countDocuments()
        const queryConditions = {};
        if (filter) {
            queryConditions[filter[0]] = { '$regex': filter[1], '$options': 'i' };
        }

        const students = await Student.find(queryConditions)
            .limit(limit)
            .skip(page * limit);

        return {
            status: 'OK',
            message: 'Success',
            data: students,
            total: totalStudents,
            pageCurrent: Number(page) + 1,
            totalPage: Math.ceil(totalStudents / limit),
        };
    } catch (e) {
        console.error('Error in getPaginationStudent:', e);
        throw new Error('Failed to retrieve students');
    }
}

const getDetailsStudent = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const student = await Student.findOne({
                _id:id
            })
            if (student === null) {
                resolve({
                    status: 'OK',
                    message: 'The student not defined'
                })
            }


            resolve({
                status: 'OK',
                message: 'Success',
                data: student
            })
        } catch (e) {
            reject(e)
        }
    })
}



const studentSchedule = async (studentId) => {
    try {
        const currentDate = new Date();
        const student_id = new mongoose.Types.ObjectId(studentId);

        // Find the current or upcoming term based on today's date
        const currentTerm = await Term.findOne({ startDate: { $lte: currentDate }, endDate: { $gte: currentDate } });
        if (!currentTerm) {
            throw new Error('No current or upcoming term found.');
        }
        const term_id = currentTerm._id;
        console.log("term_id", term_id)

        // Fetch the student to get enrolled courses for the current term
        const student = await Student.findById(student_id).populate({
            path: 'enrolledCourses',
            match: { termsOffered: term_id },
        });

        console.log("student", student)

        if (!student || !student.enrolledCourses.length) {
            throw new Error('Student not found or not enrolled in any courses for the current term.');
        }

        const courseIds = student.enrolledCourses.map(course => course._id);

        // Fetch slots for the student's enrolled courses in the current term
        const slots = await Slot.find({ courseId: { $in: courseIds }, termId: term_id })
                                .populate('roomId')
                                .populate({
                                    path: 'courseId',
                                    populate: { path: 'instructors' },
                                })
                                    
        console.log("slotsAttendance", slots)
        // Fetch student groups the student belongs to for the current term
        const studentGroups = await StudentGroup.find({ members: student_id, termId: term_id });
        const studentGroupMap = studentGroups.reduce((map, group) => {
            const courseIdStr = group.courseId.toString();
            if (map.has(courseIdStr)) {
                map.set(courseIdStr, [...map.get(courseIdStr), group.name]);
            } else {
                map.set(courseIdStr, [group.name]);
            }
            return map;
        }, new Map());

console.log("studentGroups", studentGroups)
console.log("studentGroupMap", studentGroupMap)
        // Fetch attendance records for the student for these slots/courses in the current term
const attendanceRecords = await Attendance.find({
    studentId: student_id,
    courseId: { $in: courseIds },
    termId: term_id
}).sort('date'); 

let schedule = [];

        // Create a schedule entry for each unique attendance record
        attendanceRecords.forEach(record => {
            const slot = slots.find(slot => slot._id.equals(record.slotId) && slot.courseId._id.equals(record.courseId));
            if (slot) {
                schedule.push({
                    attendanceId: record._id.toString(),
                    studentId: student_id.toString(),
                    name: student.name,
                    day: slot.day,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    courseTitle: slot.courseId.title,
                    instructors: slot.courseId.instructors.map(instructor => instructor.name),
                    room: slot.roomId ? slot.roomId.building : 'Room information not available',
                    termName: currentTerm.name,
                    studentGroup: studentGroupMap.get(slot.courseId._id.toString())?.join(', ') || 'No Group', // This needs further adjustment if you want to include group info
                    totalSlots: slot.courseId.totalSlots,
                    attendanceDate: record.date.toISOString().substring(0, 10), // format date as YYYY-MM-DD
                    attendanceStatus: record.status
                });
            }
        });

        return schedule;
    } catch (error) {
        console.error('Error generating schedule:', error);
        throw error;
    }
};




// const studentUpdatePoint = async (studentId) => {
//     try {
//         const student_id = new mongoose.Types.ObjectId(studentId);
//         const student = await Student.findById(student_id).populate('enrolledCourses');
//         if (!student) throw new Error('Student not found.');
//         if (!student.enrolledCourses.length) throw new Error('Student is not enrolled in any courses.');

//         const pointsPerCourse = {};
//         let totalPoints = 0; // Initialize total points

//         for (const course of student.enrolledCourses) {
//             let points = 0;

//             // Fetch only the latest attendance record, already sorted by date in descending order
//             const latestAttendance = await Attendance.findOne({
//                 studentId: student_id,
//                 courseId: course._id
//             }).sort({ date: -1 });

//             if (latestAttendance && latestAttendance.date < new Date() && latestAttendance.status === 'present') {
//                 const totalSlots = course.totalSlots;
//                 const attendanceCount = await Attendance.countDocuments({
//                     studentId: student_id,
//                     courseId: course._id,
//                     status: 'present'
//                 });
//                 points = attendanceCount * 10; // Award points for each 'present' attendance

//                 if (attendanceCount === totalSlots) {
//                     points += 100; // Add extra points if all sessions attended are present and match the total slots
//                 }
//             }

//             pointsPerCourse[course._id.toString()] = points;
//             totalPoints += points; // Sum up all points
//         }

//         // Update student's total points in the database
//         student.points = totalPoints;
//         await student.save();

//         // Optionally reset points here if needed
//         // student.points = 0;
//         // await student.save();

//         return pointsPerCourse;
//     } catch (error) {
//         console.error('Error updating points:', error);
//         throw error;
//     }
// };


const studentUpdatePoint = async (studentId) => {
    try {
        const student_id = new mongoose.Types.ObjectId(studentId);
        const student = await Student.findById(student_id).populate('enrolledCourses');
        console.log("student", student)
        if (!student) throw new Error('Student not found.');
        if (!student.enrolledCourses.length) throw new Error('Student is not enrolled in any courses.');

        // Initialize total points with existing student points
        let totalPoints = student.points || 0;

        for (const course of student.enrolledCourses) {
            let points = 0;
            console.log("course", course)
            // Fetch only the latest attendance record, already sorted by date in descending order
            const latestAttendance = await Attendance.findOne({
                studentId: student_id,
                courseId: course._id,
                countedForPoints: false // only consider uncounted attendance records
            }).sort({ date: -1 });

            console.log("latestAttendance", latestAttendance)

            if (latestAttendance && latestAttendance.date < new Date()) {
                const totalSlots = course.totalSlots;
                const attendanceCount = await Attendance.countDocuments({
                    studentId: student_id,
                    courseId: course._id,
                    status: 'present',
                    countedForPoints: false // only count uncounted attendances
                });

                console.log("attendanceCount", attendanceCount)

                points = attendanceCount * 10; // Award points for each 'present' attendance

                // Update attendance records as counted
                await Attendance.updateMany({
                    studentId: student_id,
                    courseId: course._id,
                    status: 'present',
                    countedForPoints: false
                }, {
                    $set: { countedForPoints: true }
                });

                if (attendanceCount === totalSlots) {
                    points += 100; // Add extra points if all sessions attended are present and match the total slots
                }
            }

            totalPoints += points; // Sum up all points
        }

        // Update student's total points in the database
        student.points = totalPoints;
        await student.save();

        return totalPoints; // Return total points
    } catch (error) {
        console.error('Error updating points:', error);
        console.log("error", error)
        throw error;
    }
};
























module.exports = {
    createStudent,
    updateStudent,
    updateAttendance,
    deleteStudent,
    getAllStudent,
    getDetailsStudent,
    studentSchedule,
    getPaginationStudent,
    studentUpdatePoint
}