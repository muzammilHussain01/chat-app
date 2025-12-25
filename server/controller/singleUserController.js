const mongoose = require("mongoose");
const User = require("../schema/userSchema");

const singleUserController = async (req, res) => {
    try {
        /* ---------------- BASIC VALIDATION ---------------- */
        const { username, email, status } = req.body;

        if (!username || !email) {
            return res.status(400).json({
                success: false,
                message: "Username and email are required"
            });
        }

        /* ---------------- CHECK EXISTING USER ---------------- */
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        /* ---------------- HANDLE AVATAR (GRIDFS) ---------------- */
        let avatarId = null;

        if (req.file) {
            // Create GridFS bucket
            const bucket = new mongoose.mongo.GridFSBucket(
                mongoose.connection.db,
                { bucketName: "avatars" }
            );

            // Open upload stream
            const uploadStream = bucket.openUploadStream(
                `${Date.now()}-${req.file.originalname}`,
                {
                    contentType: req.file.mimetype
                }
            );

            // Write file buffer to MongoDB
            uploadStream.end(req.file.buffer);

            avatarId = uploadStream.id;
        }

        /* ---------------- SAVE USER ---------------- */
        const user = await User.create({
            username,
            email,
            status: status || "online",
            avatar: avatarId
        });

        /* ---------------- RESPONSE ---------------- */
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                status: user.status,
                avatar: avatarId
            }
        });

    } catch (error) {
        console.error("Create user error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = singleUserController;
