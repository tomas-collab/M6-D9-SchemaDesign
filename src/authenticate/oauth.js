import GoogleStrategy from 'passport-google-oauth20'
import passport from 'passport'
import authorModel from '../services/authors/schema.js'
import { jwtAuth } from './tools'

const googleStrategy = new GoogleStrategy({
    clientId:process.env.GOOGLE_OAUTH_ID,
    clientSecret:process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: `${process.env.API_URL}:${process.env.PORT}/authors/googleRedirect`,
},
async (accessToken,refreshToken,profile,passportNext)=>{
    try {
        const author = await authorModel.findOne({googleId:profile.id})
        if(author){
            const tokens = jwtAuth(author)
            passportNext(null, { tokens })
        }else{
            const newAuthor = {
                name: profile.name.givenName,
                surname: profile.name.familyName,
                email: profile.emails[0].value,
                googleId: profile.id,
              }
              const createAuthor = new authorModel(newAuthor)
              const saveAuthor = await createAuthor.save()
              const tokens = await jwtAuth(saveAuthor)
              passportNext(null, { author: saveAuthor, tokens })
        }
    } catch (error) {
        console.log(error)
        passportNext(error)
    }
    passport.serializeUser(function(author,passportNext){
        passportNext(null,author)
    })
}
)
export default googleStrategy
