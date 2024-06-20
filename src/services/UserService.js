const User  = require("../models/UserModel")
const Student  = require("../models/StudentModel")
const Instructor  = require("../models/InstructorModel")
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken, customAccessTokenProcessing } = require("./JwtService");

// async function removeUniqueIndex() {
//     try {

//         // Replace 'details.name_1' with the actual index name if different
//         await User.collection.dropIndex('details.email_1');
//         console.log('Index removed successfully');
//     } catch (error) {
//         console.error('Error removing index:', error.message);
//     } 
// }

// removeUniqueIndex();

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        if (!newUser) {
            return reject(new TypeError("New user data is required"));
        }

        const { username, password, role, details } = newUser;
        const { name, email } = details;

        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return resolve({
                    status: 'ERR',
                    message: 'Username already exists'
                });
            }

            // Check for existing email
            const existingEmail = await User.findOne({ 'details.email': email });
            if (existingEmail) {
                return resolve({
                    status: 'ERR',
                    message: 'Email already exists'
                });
            }

            const hashedPassword = bcrypt.hashSync(password, 10);
            const createdUser = await User.create({
                username,
                password: hashedPassword,
                role,
                details: {
                    name,
                    email
                }
            });

            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'User successfully created',
                    data: createdUser
                });
            }
        } catch (e) {
            console.log('service', e)

            reject({
                status: 'ERR',
                message: 'Error creating user',
                error: e.message
            });
        }
    });
};

// const loginUser = (userLogin) => {
//     return new Promise(async (resolve, reject) => {
//         if (!userLogin) {
//             return reject(new TypeError("userLogin object is undefined"));
//         }
//         const { password, email } = userLogin
        
//         try {
            
//             const checkUser = await User.findOne({
//                 'details.email': email
//             })
//             if (checkUser === null) {
//                 resolve({
//                     status: 'ERR',
//                     message: 'The user is not defined'
//                 })
//             }
//             const comparePassword = bcrypt.compareSync(password, checkUser.password)
//             if (!comparePassword) {
//                 resolve({
//                     status: 'ERR',
//                     message: 'The password or user is incorrect'
//                 })
//             }

//             const access_token =  await generalAccessToken({
//                 id: checkUser.id,
//                 role: checkUser.role
//             })


//             const refresh_token = await generalRefreshToken({
//                 id: checkUser.id,
//                 role: checkUser.role
//             })
//             resolve({
//                 status: 'OK',
//                 message: 'SUCCESS',
//                 access_token
                
//             })

//         } catch (e) {
//             reject(e)
//         }
//     })
// }




const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin; // Assuming role is provided during login

        try {
            // First, find the user in the Users collection to check the password
            const userInUsers = await User.findOne({ 'details.email': email });
            console.log('userInUsers', userInUsers)
            if (!userInUsers) {
                return resolve({ status: 'ERR', message: 'Email incorrect!' });
            }

            // Validate password
            const isPasswordValid = bcrypt.compareSync(password, userInUsers.password);
            if (!isPasswordValid) {
                return resolve({ status: 'ERR', message: 'Invalid password!' });
            }

            let specificUser;
            let tokenPayload;

            // After password validation, find the specific user in their respective collection
            if (userInUsers.role === 'student') {
                specificUser = await Student.findOne({ email });
                console.log('specificstudent', specificUser)
                tokenPayload = { id: specificUser._id, name: specificUser.name, role: 'student' };
            } else if (userInUsers.role === 'instructor') {
                specificUser = await Instructor.findOne({ email });
                console.log('specificinstructor', specificUser)
                tokenPayload = { id: specificUser._id, name: specificUser.name, role: 'instructor' };
            }else {
                // For other roles, use userInUsers for token generation
                tokenPayload = { id: userInUsers._id, role: userInUsers.role };
            }

            if (!specificUser && (userInUsers.role === 'student' || userInUsers.role === 'instructor')) {
                return resolve({ status: 'ERR', message: `No ${userInUsers.role} found with this email` });
            }

            // Generate access token and refresh token using the id from the Users collection
            const access_token = await generalAccessToken(tokenPayload);
            const refresh_token = await generalRefreshToken(tokenPayload);

            resolve({
                status: 'OK',
                message: 'Login successful',
                data: {
                    access_token,
                    refresh_token,
                    user: specificUser || userInUsers // specific user data from their respective collection or user data from Users collection
                }
            });
        } catch (e) {
            reject({ status: 'ERR', message: 'Login failed', error: e.message });
        }
    });
};






const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.hasOwnProperty('password')) {
                // Hash the new password
                const hashedPassword = bcrypt.hashSync(data.password, 10);
                // Update the data object with the hashed password
                data.password = hashedPassword;
            }


            const checkUser = await User.findOne({
                _id:id
            })
            console.log('checkUser', checkUser)
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The email is not defined'
                })
            }

            const updateUser = await User.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id:id
            })
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }

            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()

            resolve({
                status: 'OK',
                message: 'Success',
                data: allUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getPaginationUser = async (limit = 4, page = 0, filter) => {
    try {
        const totalUsers = await User.countDocuments()
        const queryConditions = {};
        if (filter) {
            queryConditions[filter[0]] = { '$regex': filter[1], '$options': 'i' };
        }

        const users = await User.find(queryConditions)
            .limit(limit)
            .skip(page * limit);

        return {
            status: 'OK',
            message: 'Success',
            data: users,
            total: totalUsers,
            pageCurrent: Number(page) + 1,
            totalPage: Math.ceil(totalUsers / limit),
        };
    } catch (e) {
        console.error('Error in getPaginationUser:', e);
        throw new Error('Failed to retrieve users');
    }
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id:id
            })
            if (user === null) {
                resolve({
                    status: 'OK',
                    message: 'The user not defined'
                })
            }


            resolve({
                status: 'OK',
                message: 'Success',
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
}




module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    getPaginationUser
}