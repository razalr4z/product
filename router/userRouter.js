const user=require('../models/usermodel')
const express=require('express')
const router= express.Router()
const bcrypt=require('bcrypt')

router.get('/get_register',(req,res)=>
{
    res.render('register')
})
router.post('/register',async(req,res)=>
{
    const {userName,email,password}=req.body
    const passwordhash=await bcrypt.hash(password,10)
    const data=await user.create(
        {
            userName:userName,
            email:email,
            password:passwordhash
        }
    )
    res.redirect("/user/get_login")
})

router.get('/get_login',(req,res)=>
{
    res.render('login')
})

router.post('/login',async(req,res)=>
{
    const {userName,password}=req.body
    const data=await user.findOne({
        userName:userName})
        if(!data)
        {
           return res.redirect('/user/get_login')
        }
        const match=await bcrypt.compare(password,data.password)
        if(!match)
        {
            res.redirect('/user/get_login')
        }

        req.session.userid=data._id
        req.session.username=data.userName
        res.redirect('/products/home')
    
})
router.get('/logout',(req,res)=>
{
    req.session.destroy((err)=>
    {
    if(err)
    {
        res.send(" something wrong occured ")
    }
    res.redirect('/user/get_login')
})
})
module.exports=router