import express from 'express'
import q2m from 'query-to-mongo'
import { auth } from '../../authenticate/index.js'


import authorBlog from './schema.js'

const authorRouter = express.Router()

authorRouter.get('/',async(req,res,next)=>{
    try {
        // const query =q2m(req.query)
        // const total = await authorBlog.countDocuments(query.criteria)
        const author = await authorBlog.find()
        res.send(author)
    } catch (error) {
        next(error)
    }
})
authorRouter.route('/me')
.get(auth,async(req,res,next)=>{
    try {
        
    } catch (error) {
        
    }
})
.put(auth,async(req,res,next)=>{
    try {
        
    } catch (error) {
        
    }
})
.delete(auth,async(req,res,next)=>{
    try {
        
    } catch (error) {
        
    }
})


authorRouter.post('/',async(req,res,next)=>{
    try {
        const newauthor = new authorBlog(req.body)
        const {_id}= await newauthor.save()
        res.status(201).send({_id})
    } catch (error) {
        next(error)
    }
})
export default authorRouter