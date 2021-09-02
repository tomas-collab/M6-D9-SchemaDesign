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
	    author: {
	      name: {type: String,required:true},
	      avatar:{type: String,required:true}
	    },comments:[{
			comment:String,
			rate:Number,
			commentedDate:Date
		}],
	},{
		timestamps:true
	})
export default model('Blogpost',blogSchema)