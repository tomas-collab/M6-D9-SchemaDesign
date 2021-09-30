import express from 'express'
import q2m from 'query-to-mongo'

import userBlog from './schema.js'

const userRouter = express.Router()
userRouter.route('')
.get(async(req,res,next)=>{
        try {
            const user = await userBlog.find()
            res.send(user)
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