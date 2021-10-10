import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'


export const googlePassportConfig = () => {
  return passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://server492.herokuapp.com/auth/google/callback',
        passReqToCallback: true,
      },
      function (req, accessToken, refreshToken, profile, done) {
        try {
          if (profile) {
            req.user = profile
            done(null, profile)
          }
        } catch (error) {
          done(error)
        }
      }
    )
  )
}