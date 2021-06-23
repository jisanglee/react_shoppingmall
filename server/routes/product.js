const express = require('express');
const router = express.Router();

const multer = require('multer');

const { Product } = require('../models/Product');
//=================================
//             Product
//=================================

var storage = multer.diskStorage({
    //어디에 파일 저장되는지 (지금 설정은 제일상단 uploads폴더안)
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
    },
    //파일을 저장 할 때 어떤 이름으로 저장 할 지 현재 날짜 시간_파일원래이름
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})
 
var upload = multer({ storage: storage }).single("file");

//router는 이미 앞에 도메인 /api/product를 타고 그다음 /image까지
router.post('/image', (req, res) => {
    //가져온 이미지를 저장을 해주면 된다. 파일저장(multer 필요)
    upload(req, res, err => {
        if (err) {
            return req.json({success:false,err})
        }
        //backend에서 파일 저장한 후 파일 저장한 정보를 프론트로 다시 전달
        return res.json({success:true,filePath:res.req.file.path, fileName:res.req.file.filename})
    })
})

//uploadpage
router.post('/', (req, res) => {
    //받아온 정보들을 DB에 넣어준다.
    const product = new Product(req.body);
    product.save((err) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true });
    });
})

router.post('/products', (req, res) => {
    
  //product collection에 들어있는 모든 상품 정보 가져오기 Product.find({조건})
  Product.find()
  .populate("writer")
  .exec((err, productInfo) => {
    if(err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true, productInfo })
    
  })

})

module.exports = router;
