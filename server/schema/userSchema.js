const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // frontendId: {
        //     type: Number,
        //     unique: true, // comes from frontend payload (id: 1, 4, etc.)
        //     index: true
        // },

        username: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        status: {
            type: String,
            enum: ["online", "offline", "away"],
            default: "offline"
        },

        avatar: {
            type: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
