import createHttpError from "http-errors"
import atob from 'atob'
import userModel from '../services/users/schema.js'



export const auth  = async(req,res,next)=>{
    if(!req.headers.authorization){
        next(createHttpError(401,'provide credentials in Authorization header'))
    }else{
        const decodedCredentials = atob(req.headers.authorization.split(" ")[1])
        const [email,password] = decodedCredentials.split(':')
        const user = await userModel.checkCredentials(email,password)
        if(user){
            req.user = user
            next()
        }else{
            next(createHttpError(401,'credentials not correct'))
        }
    }
}