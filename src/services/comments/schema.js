import mongoose from 'mongoose'


const {Schema, model} = mongoose

const commentSchema = new Schema({
	    comment:{type: String,required:true} ,
	    rate: {type: Number,required:true},
		author:[{type:Schema.Types.ObjectId,ref:'Author'}]
	}
	,{
		timestamps:true
	})
export default model('Comment',commentSchema)

