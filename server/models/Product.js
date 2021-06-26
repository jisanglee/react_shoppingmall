const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//product model
const productSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    title: {
        type: String,
        maxlenght:50
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default:0
    },
    images: {
        type: Array,
        default:[]
    },
    sold: {
        type: Number,
        maxlenght: 100,
        default:0
    },
    continents: {
        type: Number,
        default:1  
    },
    views: {
        type: Number,
        default:0
    }
},{timestamps:true})

//search에서 무엇에 걸릴것인가 설정
productSchema.index({
    title: 'text',
    description:'text'
}, {
    weights: {
        //타이틀에 더 중점을 둠
        title: 5,
        description:1
    }
})
const Product = mongoose.model('Product', productSchema);

module.exports = { Product }