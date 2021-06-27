const express = require('express');
const async = require('async');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");
const { Product } = require('../models/Product');
const { Payment } = require('../models/Payment');

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
        cart: req.user.cart,
        history:req.user.history
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
                res.cookie("w_auth", user.token)
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

//cart product delete
router.get('/removeFromCart', auth, (req, res) => {
    //먼저 cart안에 내가 지우려고 한 상품을 지워주기
    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            $pull: {
                "cart":{"id":req.query.id}
            }
        },
        { new: true },
        (err, userInfo) => {
            let cart = userInfo.cart
            //지우고 남은 아이디
            let array = cart.map(item => {
                return item.id
            })
            //product collection에서 현재 남아있는 상품들의 정보를 다시 가져오기(cartdetail) (product.js에서 했었음 Product.find({_id:})
            Product.find({ _id: { $in: array } })
                .populate('writer')
                .exec((err, productInfo) => {
                    return res.status(200).json({
                        productInfo,
                        cart
                })
            })
        }
    )
})

router.post('/successBuy', auth, (req, res) => {
    //1.userCllection안에  History핑드 안에 간단한결제정보 넣어주기
    let history = [];
    let transactionData = {};

    //redux안에있는 cartDetail정보 활용
    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: Date.now(),
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId:req.body.paymentData.paymentID
        })
        
    })
    //2.Payment Collection 안에 자세한 결제 정보들 넣어주기 (누가 어떤 물언을 어떻게 얼마나 영수증번호 몇..등등 자세하게 다나옴.)
    transactionData.user = {
        //auth통해 온 user
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }
    //paymentData를 통해 온 data
    transactionData.data = req.body.paymentData

    //product 는 history데이터를 넣어줌.
    transactionData.product = history

    //history 정보 저장
    User.findOneAndUpdate(
        { _id: req.user._id },
        //history 정보 푸시하고 cart데이터 비워주기
        { $push: { history: history }, $set: { cart: [] } },
        { new: true },
        (err, user) => {
            if (err) return res.json({ success: false, err })
            
            //payment에다가 transactionData정보 저장
            const payment = new Payment(transactionData)
            payment.save((err, doc) => {
                if (err) return res.json({ success: false, err })
                
                //3. Product Collection 안에 있는 sold 필드 정보 업데이트 하기

                //상품당 몇개의 quantity를 샀는지
                let products = [];
                doc.product.forEach(item => {
                    products.push({ id: item.id, quantity: item.quantity })
                })
                async.eachSeries(products, (item, callback) => {
                    Product.updateOne(
                        { _id: item.id },
                        { $inc: { "sold": item.quantity } },
                        //원래는 update된 doc을 프론트엔드에 보내줘야하니까 new:true로했는데 여기선 그럴필요없음. 그래서 false
                        { new: false },
                        callback
                    )
                }, (err) => {
                    if (err) return res.status(400).json({ success: false, err })
                    res.status(200).json({
                        success: true,
                        cart: user.cart,
                        cartDetail:[]
                    })
                })

            })
        }
    )
        
})
module.exports = router;
