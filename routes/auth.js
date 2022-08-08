const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_Secret)
        .toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch(err){
        res.status(500).json(err);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        // if not found user, respond that
        // JS: from left to right, if all true return last(which is a operation here), else return false
    !user && res.status(401).json("wrong username!");

    const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASSWORD_Secret
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        // if password incorrect, respond that part
    OriginalPassword !== req.body.password && res.status(401).json("wrong password");

    const accessToken = jwt.sign(
        {
        id:user._id, 
        isAdmin: user.isAdmin,
         }, 
        process.env.JWT_Secret,
        {expiresIn:"3d"}
    );
    //Only show others, dont show password on the response
    const { password, ...others } = user._doc;
    res.status(200).json({...others, accessToken});

    } catch (err) {
        res.status(500).json(err);
    }
    
})

module.exports = router;