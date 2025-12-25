const mongoose = require("mongoose");
const User = require("../schema/userSchema");
const Group = require("../schema/groupSchema");

async function groupController(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { type, groupName, members } = req.body;

        const isInvalid =
            typeof type !== "string" ||
            !["private", "group"].includes(type) ||
            typeof groupName !== "string" ||
            groupName.trim().length < 3 ||
            !Array.isArray(members) ||
            members.length < 2;

        if (isInvalid) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Invalid request payload"
            });
        }

        const emails = members.map(m => m.email);

        const existingUsers = await User.find({
            email: { $in: emails }
        }).session(session);

        const userMap = new Map(
            existingUsers.map(u => [u.email, u])
        );

        const userIds = [];

        for (let i = 0; i < members.length; i++) {
            const member = members[i];

            let user = userMap.get(member.email);

            if (!user) {
                const created = await User.create(
                    [{
                        frontendId: member.id,
                        username: member.username,
                        email: member.email,
                        status: member.status,
                        avatar: member.avatar
                    }],
                    { session }
                );
                user = created[0];
            }

            userIds.push(user._id);
        }

        const group = await Group.create(
            [{
                type,
                groupName: groupName.trim(),
                members: userIds,
                createdBy: userIds[0] // temporary
            }],
            { session }
        );

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            data: group[0]
        });

    } catch (error) {
        await session.abortTransaction();
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        session.endSession();
    }
}

module.exports = groupController;
