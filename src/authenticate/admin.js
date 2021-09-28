import createHttpError from "http-errors"

export const adminMiddleware =async(req,res,next)=>{
      if(req.user.role=== 'Admin'){
          next()
      }else{
          next(createHttpError(403, "not Admin"))
      }
}