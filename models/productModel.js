const mongoose=require('mongoose')
const productSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    },
    productName:String,
    productPrice:Number,
    product_image:String
})

const ProductModel=mongoose.model('Product',productSchema)
module.exports=ProductModel