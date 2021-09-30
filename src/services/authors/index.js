import express from 'express'
import createHttpError from 'http-errors'
import passport from 'passport'
import q2m from 'query-to-mongo'
import { AuthorAuth } from '../../authenticate/author.js'
import { jwtAuth } from '../../authenticate/tools.js'


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
.put(AuthorAuth,async(req,res,next)=>{
    try {
        req.author.name = req.body.name
        await req.author.save()
        res.send()
    } catch (error) {
        next(error)
    }
})
.delete(AuthorAuth,async(req,res,next)=>{
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


authorRouter.route("/login")
.post(async(req,res,next)=>{
    try {
       const {email,password} = req.body
       const author = await authorBlog.checkCredentials(email,password)
       console.log('author',author)
       if(author){
           const Authorization = await jwtAuth(author)
           res.send({Authorization})
       }else{
           next(createHttpError(401,'something wrong with credentials'))
       }
    } catch (error) {
        next(error)
    }
})

authorRouter.route('/register')
.post(async(req,res,next)=>{
    try {
        const newRegistration = new authorBlog(req.body)
        const author = await newRegistration.save()
        res.send(author)
    } catch (error) {
        next(error)
    }
})

authorRouter.route('/googleLogin')
.get(passport.authenticate('google',{scope:['profile','email']}))


authorRouter.route('/googleRedirect')
.get(passport.authenticate('google'),async(req,res,next)=>{
    try {
        res.redirect(`http://localhost:3001?accessToken=${req.author.tokens.accessToken}`)
    } catch (error) {
        next(error)
    }
})

export default authorRouter