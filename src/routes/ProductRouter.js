const express = require("express");
const router = express.Router();
const productController = require('../controllers/ProductController');
const { authMiddleWare } = require("../middleware/authMiddleware");
const fileUpload = require('express-fileupload');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Middleware to handle file upload
router.use(fileUpload());

// const handleFileUpload = (req, res, next) => {
//     // Assuming the image is sent with the name 'image'
//     if (!req.files || !req.files.image) {
//         return res.status(400).json({ message: 'Image file was not uploaded.' });
//     }

//     console.log("files", req.files)

//     const image = req.files.image;
//     const videos = req.files;

//     // Move the image file to a destination directory
//     const uploadDir = path.join(__dirname, '../uploads/');
//     const imageFileName = uuidv4() + '-' + image.name;
//     const imageFilePath = path.join(uploadDir, imageFileName);

//     image.mv(imageFilePath, (err) => {
//         if (err) {
//             return res.status(500).json({ message: 'Error uploading image file.', error: err });
//         }

//         const videoFileNames = [];

//         // Iterate over the keys of the videos object
//         Object.keys(videos).forEach((key, index) => {
//             // Skip the image key
//             if (key !== 'image') {
//                 const video = videos[key];
//                 const videoFileName = uuidv4() + '-' + video.name;
//                 const videoFilePath = path.join(uploadDir, videoFileName);

//                 video.mv(videoFilePath, (err) => {
//                     if (err) {
//                         return res.status(500).json({ message: `Error uploading video file ${index}.`, error: err });
//                     }
//                     videoFileNames.push(videoFileName);

//                     // If all videos are uploaded, proceed to the next middleware
//                     if (videoFileNames.length === Object.keys(videos).length - 1) {
//                         req.uploadedImage = imageFileName;
//                         req.uploadedVideos = videoFileNames;
//                         next();
//                     }
//                 });
//             }
//         });
//     });
// };

const handleFileUpload = (req, res, next) => {
    console.log("files", req.files);

    const uploadDir = path.join(__dirname, '../uploads/');
    let imageFileName, videoFileNames = [];

    // Handle image file if uploaded
    if (req.files && req.files.image) {
        const image = req.files.image;
        imageFileName = uuidv4() + '-' + image.name;
        const imageFilePath = path.join(uploadDir, imageFileName);
        image.mv(imageFilePath, err => {
            if (err) {
                return res.status(500).json({ message: 'Error uploading image file.', error: err });
            }
            req.uploadedImage = imageFileName;
            handleVideoUploads(); // Function to handle video uploads separately
        });
    } else {
        handleVideoUploads(); // Directly handle video uploads if no image is uploaded
    }

    function handleVideoUploads() {
        const videos = req.files;
        let uploadedCount = 0;
        const totalVideos = Object.keys(videos).length - (req.files.image ? 1 : 0); // Adjust count if image is included

        if (totalVideos === 0) {
            next(); // No videos to process, move to next middleware
            return;
        }

        Object.keys(videos).forEach((key, index) => {
            if (key !== 'image') {
                const video = videos[key];
                const videoFileName = uuidv4() + '-' + video.name;
                const videoFilePath = path.join(uploadDir, videoFileName);

                video.mv(videoFilePath, err => {
                    if (err) {
                        return res.status(500).json({ message: `Error uploading video file ${index}.`, error: err });
                    }
                    videoFileNames.push(videoFileName);
                    uploadedCount++;

                    // If all videos are processed, proceed to the next middleware
                    if (uploadedCount === totalVideos) {
                        req.uploadedVideos = videoFileNames;
                        next();
                    }
                });
            }
        });
    }
};


// Use the middleware in your routes
router.post('/create', handleFileUpload, productController.createProduct);
router.put('/update/:id', handleFileUpload, productController.updateProduct);
router.delete('/delete/:id' , productController.deleteProduct)
router.get('/get-all', productController.getAllProduct)
router.get('/get-pagination', productController.getPaginationProduct)
router.get('/get-details/:id', productController.getDetailsProduct)
router.put('/update-notes/:id', productController.updateNotes);
router.put('/update-lock-status/:id', productController.updateLockStatus);


module.exports = router