import express from 'express'
import blogModel from './schema.js'
import commentModel from '../comments/schema.js'
import createError from 'http-errors'
const blogPostsRouter = express.Router()

blogPostsRouter.route('/')
.get(async(req,res,next)=>{
    try {
        const blogs = await blogModel.find()
        res.send(blogs)
    } catch (error) {
        next(error)
    }
})
.post(async(req,res,next)=>{
    try {
        const newBlog = new blogModel(req.body)
        const {_id}= await newBlog.save()
        res.status(201).send({_id})
    } catch (error) {
        next(error)
    }
})
blogPostsRouter.route('/:blogId')
.get(async(req,res,next)=>{
    try {
        const blogId = req.params.blogId
        const blog = await blogModel.findById(blogId)
        if(blog){
            res.send(blog)
        }else{ next(createError(404, `blog with id ${blogId} not found!`))}
    } catch (error) {
        next(error)
    }
})
.put(async(req,res,next)=>{
    try {
        const blogId = req.params.blogId
        const modifiedBlog = await blogModel.findByIdAndUpdate(blogId,req.body,{
            new:true
        })
        if(modifiedBlog){
            res.send(modifiedBlog)
        }else{ next(createError(404, `blog with id ${blogId} not found!`))}
    } catch (error) {
        next(error)
    }
})
.delete(async(req,res,next)=>{
    try {
        const blogId = req.params.blogId
        const deltedBlog = await blogModel.findByIdAndDelete(blogId)
        if(deltedBlog){
            res.send(deltedBlog)
        }else{ next(createError(404, `blog with id ${blogId} not found!`))}
    } catch (error) {
        next(error)
    }
})









blogPostsRouter.route('/:blogId/comments')
.get(async(req,res,next)=>{
    try {
        const blogs = await blogModel.findById(req.params.blogId)
        if(user){
            res.send(blogs.blogs)
        }else{
            next(createError(404, `blog with id ${req.params.userId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})
.post(async(req,res,next)=>{
    try {
        const comments = await commentModel.findById(req.body.commentId,{_id:0})
        if(comments){
            const postComment = {...comments.toObject(), commentedDate:new Date()}
            const updatedBlog = await blogModel.findByIdAndUpdate(
                req.params.blogId,{$push:{comments:postComment}},
                {new:true}
            )
            if (updatedBlog) {
                res.send(updatedBlog)
              } else {
                next(createError(404, `blog with id ${req.params.blogId} not found!`))
              }
        }else{
            next(createError(404, `comment with id ${req.body.commentId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

blogPostsRouter.route('/:blogId/comments/:commentId')
.get(async(req,res,next)=>{try {
    const blog = await blogModel.findById(req.params.blogId)
    if(blog){
        comment = blog.find(b=>b._id.toString()===req.params.commentId)
        if(comment){
            res.send(comment)
        }else{
            next(createError(404, `comment with id ${req.params.commentId} not found!`))
        }
    }else{
        next(createError(404, `blog with id ${req.params.blogId} not found!`))
    }
} catch (error) {
    next(error)
}})
.put(async(req,res,next)=>{
    try {
    const blog = await blogModel.findOneAndUpdate({_id:req.params.blogId,"comments._id":req.params.commentId}
    ,{
        $set:{
            "comments.$":req.body
        },
    },{new:true})
    if(blog){
        res.send(blog)
    }else{
        next(createError(404, `blog with id ${req.params.blogId} not found!`))
    }

} catch (error) {
    next(error)
}})
.delete(async(req,res,next)=>{try {
    const blog= await blogModel.findOneAndUpdate(
        req.params.blogId,
        {$pull:{comments:{id_:req.params.commentId},},},{new:true}
    )
    if(blog){
        req.send(blog)
    }else{
        next(createError(404, `blog with id ${req.params.blogId} not found!`))
    }
} catch (error) {
    next(error)
}})


export default blogPostsRouter