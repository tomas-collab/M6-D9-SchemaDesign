import express from 'express'
import q2m from 'query-to-mongo'

import userBlog from './schema.js'

const userRouter = express.Router()

userRouter.get('/',async(req,res,next)=>{
    try {
        // const query =q2m(req.query)
        // const total = await userBlog.countDocuments(query.criteria)
        const user = await userBlog.find()
        res.send(user)
    } catch (error) {
        next(error)
    }
})
userRouter.post('/',async(req,res,next)=>{
    try {
        const newuser = new userBlog(req.body)
        const {_id}= await newuser.save()
        res.status(201).send({_id})
    } catch (error) {
        next(error)
    }
})
export default userRouter