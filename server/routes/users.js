const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post("/addToCart", auth, (req, res) => {
    //먼저 User Collection에 해당 유저의 정보 가져오기. req에서 user정보가 있는건 auth 미들웨어에서 user정보를 가지고 있기 때문.
    User.findOne({ _id: req.user._id },
        (err, userInfo) => {
            //같은지 안같은지 확인하는 duplicate false면 상품이 없는거고 true면 같은 상품이 있는거.
            let duplicate = false; 
            //가져온 정보에서 카트에다 넣으려 하는 상품이 있는지 확인
            userInfo.cart.forEach((item) => {
                if (item.id === req.body.productId) {
                    duplicate = true;
                }
            })
            //상품이 중복으로 있다면? 상품갯수 1로 올리기
            if (duplicate) {
                User.findOneAndUpdate(
                    { _id: req.user._id, "cart.id": req.body.productId },
                    { $inc: { "cart.$.quantity": 1 } },
                    { new: true }, //이건 퀘리를 돌리고나서 결과값(err,userInfo)을 받는데,  update를 시켜준것이기 때문에 new:true라는 옵션을 줘야함.
                    (err, userInfo) => {
                        if (err) return res.status(400).json({ success: false, err })
                        res.status(200).send(userInfo.cart) //프론트엔드로 cart정보 다보내줌
                    }
                )
            } else {
            //이미 있지 않다면 필요한 상품정보(상품ID, 개수1,날짜정보) 다 넣어줘야함. //이렇게 카트에 상품이 추가 된 정보를 Redux안에 저장 >> Auth Route 바구기 cart field와 history field 추가
                User.findOneAndUpdate(
                    { _id: req.user._id },
                    {
                        $push: {
                            cart: {
                                id: req.body.productId,
                                quantity: 1,
                                date:Date.now()
                            }
                        }
                    },
                    { new: true },
                    (err, userInfo) => {
                        if (err) return res.status(400).json({ success: false, err })
                        res.status(200).send(userInfo.cart)
                    }
                )
            }
        }
    )
});

module.exports = router;
