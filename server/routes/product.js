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
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm

  let findArgs = {};

  for (let key in req.body.filters) {
    // key는 continents나 price
    if (req.body.filters[key].length > 0) {
      // console.log('key : ',key)
      if (key === "price") {
        findArgs[key] = {
          //greater than equal큼  //last than equal작거나같음
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1]
        }
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }
  console.log('findArgs : ',findArgs,'TERM : ',term)
  if (term) {
    Product.find(findArgs)
      .find({$text:{$search:term}})
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
      if(err) return res.status(400).json({ success: false, err })
      return res.status(200).json({
        success: true,
        productInfo,
        postSize: productInfo.length
      })
      
    })
  } else {
    //product collection에 들어있는 모든 상품 정보 가져오기 Product.find({조건})
    Product.find(findArgs)
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
      if(err) return res.status(400).json({ success: false, err })
      return res.status(200).json({
        success: true,
        productInfo,
        postSize: productInfo.length
      })
      
    })
  }
})

// axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
//각product 화면
router.get('/products_by_id', (req, res) => {
  let type = req.query.type
  //id가 하나일때
  let productIds = req.query.id
  //id가 하나가 아니라 여러개면 type=array id=1215125,12621612,1616122 이런식을 split해서 productIds = ['1215125','12621612','1616122']
  if (type === "array") {
    let ids = req.query.id.split(',')
    productIds = ids.map(item => {
      return item
    })
  }
  //productIds를 이용해서 데이터를 가져온다.
  Product.find({ _id: { $in: productIds } })
    .populate('writer')
    .exec((err, product) => {
      if (err) return res.status(400).send(err)
      return res.status(200).json({success:true, product})
    })

})
module.exports = router;
