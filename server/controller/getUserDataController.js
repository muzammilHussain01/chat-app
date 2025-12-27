const User = require("../schema/userSchema")
async function getUserData (req, res) {
    console.log("Get user data api is running..........")
    try {
        const users = await User.find({});
        console.log("try block")
        return res.status(200).json({
            success: true,
            data: users,
        })
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: e.message
        })
    }
}
module.exports = getUserData;