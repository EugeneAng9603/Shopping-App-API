const router = require("express").Router();
//const stripe = require("stripe")(process.env.STRIPE_KEY);
const stripe = require("stripe")("pk_live_51KrZfvEGuPjR94JKVDkqaFvHXh7gwU2egqMIqkgQryW0quR7lpYaqwg0hZuq5M2kf1Cgh2ZlWOQww9mdL0x5yzMe00H0drMb6L")

router.post("/payment", (req, res) => {
    stripe.charges.create(
        {
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "sgd",
        }, 
    (stripeErr, stripeRes) => {
        if (stripeErr){
            res.status(500).json(stripeErr);
        }else {
            res.status(200).json(stripeRes);
        }
    });
});

// router.post("/payment" , async (req , res) => {
//     try{
//         const stripe = require('stripe')(process.env.STRIPE_KEY);
//         const charge = await stripe.charges.create({
//             source:req.body.tokenId,
//             amount:req.body.amount,
//             currency:"usd"
//         });
//         res.status(200).json(charge)
//     }catch(err){
//         res.status(500).json(err)
//     }
// })

module.exports = router;
