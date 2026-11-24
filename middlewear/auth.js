const auth=(req,res,next)=>
{
    if(req.session.userid)
    {
        next()
    }
    else{
        return res.redirect('/user/get_login')
    }
}
module.exports=auth