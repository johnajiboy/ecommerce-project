const mongoose = require('mongoose')
const {Schema} = mongoose
const randomstring = require('randomstring')

const productSchema = new Schema({
    product_id: String,
    name:String,
    price:Number,
    category:String,
    imagePath:String
}) 

const Product = mongoose.model('product',productSchema)

module.exports = Product