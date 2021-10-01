import createHttpError from "http-errors";
import { verifyJWT } from "./tools.js";
import authorModel from '../services/authors/schema.js'

export const JWTAuthMiddleware = async(req,res,next)=>{
    // if(!req.headers.authorization){
    if(!req.headers.authorization){
        next(createHttpError(401,'yo provide credentials '))
    }else{
        try {
            const token = req.headers.authorization.replace("Bearer ","")
            const decodedToken = await verifyJWT(token)
            const author = await authorModel.findById(decodedToken._id)
            if(author){
                req.author = author
                next()
            }else{
                next(createHttpError(404,'user not found'))
            }

        } catch (error) {
            next(createHttpError(401,'token not valid'))
        }
    }
}