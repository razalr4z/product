
const express=require('express')
const router=express.Router()
const multer=require('multer')
const product=require('../models/productModel')
const auth=require('../middlewear/auth')

const storage=multer.diskStorage({
    destination:(req,file,cb)=>
    {
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>
    {
        cb(null,Date.now()+"_"+file.originalname)
    }
})
const uploads=multer({storage})

router.get("/product",(req,res)=>
{
    res.render("product")
})

router.post("/display",uploads.single("image"),auth,async(req,res)=>
{
     let {productName,productPrice}=req.body
     console.log(req.file)
     const image=`/uploads/${req.file.filename}`
    const prod=await product.create({
        productName:productName,
        productPrice:productPrice,
        product_image:image,
        user:req.session.userid
    })
   
    let data={name:productName,price:productPrice}
    res.redirect("/products/home")
})

router.get("/home",auth,async(req,res)=>
{
    const datas=await product.find({user:req.session.userid})
    res.render("home",{products:datas})
})

// UPDATE GET
router.get('/update/:id',auth,async(req,res)=>
{
    try{
        const data=await product.findById(req.params.id)
        res.render("update",{data})
    }
    catch(error)
    {
        res.redirect('/products/home')
    }
})

// UPDATE POST
router.post('/edit/:id',uploads.single("image"),auth,async(req,res)=>
{
    try{
        const {productName,productPrice}=req.body

        const data={productName,productPrice}

        if(req.file)
        {
            data.product_image=`/uploads/${req.file.filename}`
        }

        const update=await product.findByIdAndUpdate(
            req.params.id,
            data,
            {returnDocument:"after"}
        )

        res.redirect("/products/home")
    }
    catch(error)
    {
        console.log(error)
        res.redirect('/products/home')
    }
})

// DELETE
router.post('/delete/:id',auth,async(req,res)=>
{
    try{
        const data=await product.findByIdAndDelete(req.params.id)
        res.redirect('/products/home')
    }
    catch(error)
    {
        res.send("Page not Found")
    }
})

// SINGLE PRODUCT VIEW - LAST
router.get('/:id',auth,async(req,res)=>
{
    const daaata=await product.findById(req.params.id)
    if(!req.session.userid)
    {
        return res.redirect('/user/get_login')
    }
    res.render("singleView",{daaata})
})

module.exports=router
