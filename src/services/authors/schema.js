import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import atob from 'atob'

const {Schema, model} = mongoose

const authorSchema = new Schema({
	name: { type: String, required: true },
    surname: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	// blog:{type:Schema.Types.ObjectId,ref:"Blogpost"}
	},{
		timestamps:true
	})

	authorSchema.pre('save',async function(next){
		const author = this
		const plainPw = author.password
		if(author.isModified("password")){
			author.password = await bcrypt.hash(plainPw,12)
		}
		next()
	})

	authorSchema.methods.toJSON = function(){
		const AuthorData = this
		const  AuthorObject = AuthorData.toObject()
		delete AuthorObject.password
		return AuthorObject
	}

	authorSchema.statics.checkCredentials = async function(email,plainPw){
		const author = await this.findOne({email})
		if(author){
			const isMatch = await bcrypt.compare(plainPw,author.password)
			if(isMatch) return author
			else return null
		}else{
			return null
		}
	}
export default model('Author',authorSchema)

