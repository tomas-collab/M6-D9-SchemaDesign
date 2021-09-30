import createHttpError from "http-errors"
import blogModel from '../services/blogPosts/schema.js'

export const adminMiddleware =async(req,res,next)=>{
      const  blog = await blogModel.findById(req.params.blogId)
       if(blog.author._id.toString() !== req.author._id.toString()){
           res.status(403).send({"message":"invalid owner"})
           return 
       }else{
           req.blog = blog 
           next()
       }
}