import mongoose from 'mongoose'


const {Schema, model} = mongoose

const blogSchema = new Schema({
	    category:{type: String,required:true} ,
	    title: {type: String,required:true},
	    cover:{type: String,required:true},
	    readTime: {
	      value: {type:Number},
	      unit: {type:Number},
	    },
	    author: [{
	           type:Schema.Types.ObjectId,required:true,ref:'Author'
	    }],comments:[{
			comment:String,
			rate:Number,
			commentedDate:Date
		}],
		likes:{
			default:[],
			type:
			[{
				type:Schema.Types.ObjectId,ref:'Author'
			}],
		}
	},{
		timestamps:true
	})
export default model('Blogpost',blogSchema)