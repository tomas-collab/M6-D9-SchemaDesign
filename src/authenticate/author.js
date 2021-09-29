import createHttpError from "http-errors";
import atob from 'atob'
import authorModel from '../services/authors/schema.js'


export const AuthorAuth = async(req,res,next)=>{
    if(!req.headers.authorization){
        next(createHttpError(401,'provide credentials in authorization'))
    }else{
        const decodedCredentials = atob(req.headers.authorization.split(' ')[1])
        const [email,password] = decodedCredentials.split(':')
        const author = await authorModel.checkCredentials(email,password)
        if(author){
            req.author = author
            next()
        }else{
            next(createHttpError(401,'credentials not correct'))
        }
    }
}