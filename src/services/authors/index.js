import express from 'express'
import createHttpError from 'http-errors'
import passport from 'passport'
import q2m from 'query-to-mongo'
import { adminMiddleware } from '../../authenticate/admin.js'
import { AuthorAuth } from '../../authenticate/author.js'
import authorModel from './schema.js'
import authorBlog from './schema.js'
import blogModel from '../blogPosts/schema.js'
import { JWTAuthMiddleware } from '../../authenticate/token.js'
import { jwtAuth,refreshTokens} from '../../authenticate/tools.js'


const authorRouter = express.Router()

                                                            //------------GOOGLE LOGIN
authorRouter.route('/googleLogin')
.get(passport.authenticate('google',{scope:['profile','email']}))

authorRouter.route('/googleRedirect')
.get(passport.authenticate('google'),async(req,res,next)=>{
    try {
       console.log(req.user)
        res.cookie("accessToken",req.user.tokens.accessToken)
        res.redirect(`http://localhost:3001`)
    } catch (error) {
        console.log(error)
    }
})
                                                            //------------GET ALL
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
                                                            //------------ME
authorRouter.route('/me')
.get(JWTAuthMiddleware,async(req,res,next)=>{
    try {
        res.send(req.author)
    } catch (error) {
        next(error)
    }
})
.put(JWTAuthMiddleware,async(req,res,next)=>{
    try {
        const updateAuthor = await authorModel.findByIdAndUpdate(req.author._id,req.body,{new:true})
        res.send(updateAuthor)
    } catch (error) {
        next(error)
    }
})
.delete(JWTAuthMiddleware,async(req,res,next)=>{
    try {
        const deleteAuthor = await authorModel.findByIdAndDelete(req.author._id)
        res.send('deleted')
    } catch (error) {
        next(error)
    }
})

                                                             //------------POST AN AUTHOR
authorRouter.post('/',async(req,res,next)=>{
    try {
        const newauthor = new authorBlog(req.body)
        const author= await newauthor.save()
        res.status(201).send(author)
    } catch (error) {
        next(error)
    }
})
                                                             //------------REGISTER NEW AUTHOR
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

                                                             //------------LOG IN 
authorRouter.route("/login")
.post(async(req,res,next)=>{
    try {
       const {email,password} = req.body
       const author = await authorBlog.checkCredentials(email,password)
       if(author){
           const {accessToken,refreshToken} = await jwtAuth(author)
           res.send({accessToken,refreshToken})
           console.log('token',{accessToken})
       }else{
           next(createHttpError(401,'something wrong with credentials'))
       }
    } catch (error) {
        next(error)
    }
})
                                                             //------------REFRESH TOKEN ---------------
authorRouter.route('/refreshToken')
.post(async(req,res,next)=>{
    try {
        const {actualRefreshToken} = req.body
        const {accessToken,refreshToken} = await refreshTokens(actualRefreshToken)
        res.send({accessToken,refreshToken})
    } catch (error) {
        next(error)
    }
})
                                                            //------------LOG OUT ---------------
authorRouter.route('/logout')
.post(JWTAuthMiddleware,async(req,res,next)=>{
    try {
        req.author.refreshToken = null
        await req.author.save()
        res.send()
    } catch (error) {
        next(error)
    }
})

                                             
authorRouter.route('/me/blogPosts')
.get(AuthorAuth,adminMiddleware,async(req,res,next)=>{
    try {
        const authorId = req.author._id
        const myBlogpost = await blogModel.find({
            author:authorId
        })
        res.send(myBlogpost)
        
    } catch (error) {
        next(error)
    }
})

export default authorRouter