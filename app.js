const express = require ("express")
const mongoose=require('mongoose')
const app = express()
const session = require('express-session')


app.set("view engine","hbs")
app.use(express.urlencoded({extended:true}))
app.use('/uploads',express.static('uploads'))
app.use(express.static("public"))

app.use(session({
    secret:'mysecuritykey',
    resave:false,
    saveUninitialized:false
}))


mongoose.connect("mongodb://localhost:27017/e_commerce")
.then(()=>console.log("connected"))
.catch(()=>console.log("connection interrupted"))

app.use('/user',require('./router/userRouter'))
app.use('/products',require('./router/product'))

app.listen(3000,()=>
{
    console.log("Server is running in port 3000")
})
