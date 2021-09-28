import express from 'express'
import q2m from 'query-to-mongo'
import { auth } from '../../authenticate/index.js'
import userBlog from './schema.js'

const userRouter = express.Router()
userRouter.route('/')
.post(async(req,res,next)=>{
    try {
        const user = new userBlog(req.body)
        const newUser= await user.save()
        res.status(201).send(newUser)
    } catch (error) {
        next(error)
    }
})
.get(auth, async(req,res,next)=>{
    try {
        const user = await userBlog.find()
        res.send(user)
    } catch (error) {
        next(error)
    }
})
userRouter.route('/default')
.get(auth, async(req,res,next)=>{
    try {
        res.send(req.user)
    } catch (error) {
        next(error)
    }
})
.put(auth, async(req,res,next)=>{
    try {
        req.user.name = req.body.name
        await req.user.save()
        res.send()
    } catch (error) {
        next(error)
    }
})
.delete(auth, async(req,res,next)=>{
    try {
        await req.user.deleteOne()
       res.send()
    } catch (error) {
        next(error)
    }
})

userRouter.route('/:id')
.get(async(req,res,next)=>{
    try {
        const oneUser = await userBlog.findById(req.params.id)
        res.send(oneUser)
    } catch (error) {
        next(error)
    }
})

export default userRouter