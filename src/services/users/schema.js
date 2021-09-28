import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const {Schema, model} = mongoose

const userSchema = new Schema({
	name: { type: String, required: true},
	surname: { type: String, required: true},
	email: { type: String, required: true},
	password:{type:String,required:true},
	age: {type: Number, min: 18, max: 65, required:true},
	dateOfBirth: {type: Date},
	professions: [String],
	},{
		timestamps:true
	})

userSchema.pre('save', async function(next){
	const user = this
	const plainPw = user.password
	if(user.isModified("password")){
		user.password = await bcrypt.hash(plainPw,10)
	}
	next()
})

userSchema.methods.toJSON = function(){
   const userData = this
   userObject = userData.toObject()
   delete userObject.password
   return userObject
}
export default model('User',userSchema)

