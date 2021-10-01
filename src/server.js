import express from 'express'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'
import mongoose from 'mongoose'
import { badRequestErrorHandler, catchAllErrorHandler, notFoundErrorHandler, unauthorizedHandler } from './errorHandlers.js'
import authorRouter from './services/authors/index.js'
import blogsRouter  from './services/blogPosts/index.js'
import commentRouter from './services/comments/index.js'
import userRouter from './services/users/index.js'
import googleStrategy from './authenticate/oauth.js'
import passport from 'passport'
import cookieParser from 'cookie-parser'
const server = express()

const port = process.env.PORT || 3001

passport.use('google',googleStrategy)



server.use(cors({origin:'http://localhost:3001',credentials:true}))
server.use(express.json())
server.use(cookieParser())
server.use(passport.initialize())

server.use("/blogPosts", blogsRouter)
server.use('/comments',commentRouter)
server.use('/users',userRouter)
server.use('/authors',authorRouter)


server.use(badRequestErrorHandler)
server.use(catchAllErrorHandler)
server.use(notFoundErrorHandler)
server.use(unauthorizedHandler)

mongoose.connect(process.env.MONGO_CONNECTION)
mongoose.connection.on("connected",()=>{
    console.log('successfully connected to mongo')
    server.listen(port,()=>{
        console.table(listEndpoints(server))
        console.log('server is runnig on port ', port )
    })
})

mongoose.connection.on('error',err=>{
    console.log('mongo error:', err)
})