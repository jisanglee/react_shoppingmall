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

const Product = mongoose.model('Product', productSchema);

module.exports = { Product }