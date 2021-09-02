import express from 'express'
import q2m from 'query-to-mongo'

import commentBlog from './schema.js'

const commentRouter = express.Router()

commentRouter.get('/',async(req,res,next)=>{
    try {
        // const query =q2m(req.query)
        // const total = await commentBlog.countDocuments(query.criteria)
        const comment = await commentBlog.find()
        res.send(comment)
    } catch (error) {
        next(error)
    }
})
commentRouter.post('/',async(req,res,next)=>{
    try {
        const newComment = new commentBlog(req.body)
        const {_id}= await newComment.save()
        res.status(201).send({_id})
    } catch (error) {
        next(error)
    }
})
export default commentRouter