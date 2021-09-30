import GoogleStrategy from 'passport-google-oauth20'
import passport from 'passport'
import authorModel from '../services/authors/schema.js'
import { jwtAuth } from './tools'

const googleStrategy = new GoogleStrategy({
    clientId:process.env.GOOGLE_OAUTH_ID,
    clientSecret:process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: `${process.env.API_URL}:${process.env.PORT}/authors/googleRedirect`,
})

async (accessToken,refreshToken,profile,passportNext)=>{}