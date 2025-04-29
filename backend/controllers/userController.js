const Users = require('../models/User');

const removeUser = async(req, res)=>{
    await Users.findByIdAndDelete(req.body.id);
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name,
    })
}

const allUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const totalUsers = await Users.countDocuments();

        const users = await Users.find({}, { password: 0 })
            .skip(skip)
            .limit(limit);

        console.log("Users Fetched with Pagination");

        res.send({
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
}


module.exports = {
    removeUser,
    allUsers
};
