const { update, findByIdAndDelete } = require("../models/User");
const User = require("../models/User");
const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

//Update id or password
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
    if (req.body.password){
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASSWORD_Secret
            ).toString();
    };

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true}
        );

    res.status(200).json(updatedUser);

    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted.");
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get User
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    };
});

//Get All User
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query 
        //descending
        ? await User.find().sort({_id:-1}).limit(5)
        : await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get User Stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1 ));

    try {
        //aggregate data of created last year, by month, using id
        const data = await User.aggregate([
            // created at : greater than last year
            { $match: { createdAt: { $gte: lastYear}}},
            // Pass only month of createdAt, dont pass year and day and second
            {
              $project: {
                  month: { $month: "$createdAt"}
              },
            },
            // group it by id
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                },
            }
        ]);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router; 