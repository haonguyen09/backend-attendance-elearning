const UserRouter = require('./UserRouter');
const CourseRouter = require('./CourseRouter');
const DepartmentRouter = require('./DepartmentRouter');
const InstructorRouter = require('./InstructorRouter');
const RoomRouter = require('./RoomRouter');
const SlotRouter = require('./SlotRouter');
const StudentGroupRouter = require('./StudentGroupRouter');
const StudentRouter = require('./StudentRouter');
const TermRouter = require('./TermRouter');
const ProductRouter = require('./ProductRouter');
const AttendanceRouter = require('./AttendanceRouter');
const BlockChainRouter = require('./BlockChainRouter');
const PaymentRouter = require('./PaymentRouter');

const routes = (app) => {
    app.use("/api/user", UserRouter)
    app.use("/api/course", CourseRouter)
    app.use("/api/department", DepartmentRouter)
    app.use("/api/instructor", InstructorRouter)
    app.use("/api/room", RoomRouter)
    app.use("/api/slot", SlotRouter)
    app.use("/api/studentGroup", StudentGroupRouter)
    app.use("/api/student", StudentRouter)
    app.use("/api/term", TermRouter)
    app.use("/api/product", ProductRouter)
    app.use("/api/attendance", AttendanceRouter)
    app.use("/api/blockChain", BlockChainRouter)
    app.use("/api/payment", PaymentRouter)
}

module.exports = routes