import express from 'express'
import q2m from 'query-to-mongo'
import { AuthorAuth } from '../../authenticate/author.js'
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
.get(AuthorAuth,async(req,res,next)=>{
    try {
       
        res.send(req.author)
    } catch (error) {
        next(error)
    }
})
.put(auth,async(req,res,next)=>{
    try {
        req.author.name = req.body.name
        await req.author.save()
        res.send()
    } catch (error) {
        next(error)
    }
})
.delete(auth,async(req,res,next)=>{
    try {
        await req.author.deleteOne()
        res.send('deleted')
    } catch (error) {
        next(error)
    }
})


authorRouter.post('/',async(req,res,next)=>{
    try {
        const newauthor = new authorBlog(req.body)
        const author= await newauthor.save()
        res.status(201).send(author)
    } catch (error) {
        next(error)
    }
})
export default authorRouter