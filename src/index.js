const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const cors = require('cors');
const routes = require('./routes')
const path = require("path");
const helmet = require('helmet');
dotenv.config();

const app = express()
const port = process.env.PORT || 3003

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use(helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", "https://www.paypal.com"],
//         imgSrc: ["'self'", "data:"], // Allow images from the same origin and data URLs
//         // Add other directives as needed
//       }
//     }
//   }));

app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())

routes(app)

mongoose.connect(`${process.env.MONGODB}`)
    .then(() => {
        console.log('Connect Db success!')
    })
    .catch((err) => {
        console.log(err)
    })

app.listen(port, () => {
    console.log('Server is running in port: ', + port)
})