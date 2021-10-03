import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import authorModel from '../services/authors/schema.js'
 
//generate jwt accessToken
const generateJWT = payload=>
       new Promise((resolve,reject)=>
         jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:" 1 day"},(err,token)=>{
           if(err) reject(err)
            resolve(token)
     })
     )
// generate jwt refresh token
const generateRefreshJWT = payload=>
        new Promise((resolve,reject)=>
           jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn:"2 weeks"},(err,token)=>{
             if(err) reject(err)
               resolve(token)
           }))

//
export const jwtAuth = async author =>{
    const accessToken = await generateJWT({_id:author._id})
    const refreshToken = await generateRefreshJWT({_id:author._id})

       author.refreshToken = refreshToken
       await author.save()
         return {accessToken,refreshToken}
}


export const verifyJWT = token=>
         new Promise((resolve,reject)=>
         jwt.verify(token,process.env.JWT_SECRET,(err,decodedToken)=>{
             if(err) reject(err)
                resolve(decodedToken)
         }))


export const verifyRefreshToken = token=>
           new Promise((resolve,reject)=>
             jwt.verify(token,process.env.JWT_REFRESH_SECRET,(err,decodedToken)=>{
                if(err) reject(err)
                    resolve(decodedToken)
             }))

export const refreshToken = async actualRefreshToken=>{
        const decodedRefreshToken = await verifyRefreshToken(actualRefreshToken)
        const author = await authorModel.findById(decodedRefreshToken._id)
     if(!author) throw new Error('author not found')
       if(author.refreshToken === actualRefreshToken){
         const {refreshToken,accessToken} = jwtAuth(author)
         return {refreshToken,accessToken}
      }else{
        throw createHttpError(401,'refresh token not valid')
  }
}