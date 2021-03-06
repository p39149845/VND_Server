import server from './server'
import mongoose from 'mongoose'
import express from 'express';
import dotenv from "dotenv"
import passport from 'passport'

import { googlePassportConfig } from './utils/passport'
import { googleAuth } from './utils/socialProvidersAuth'

dotenv.config()
googlePassportConfig()

const app = express();

const createServer = async () => {

  try {
    await mongoose.connect(process.env.DB_URL,
      { useUnifiedTopology: true }
      )

    server.applyMiddleware({ app });

    app.get(
      '/auth/google',
      passport.authenticate('google', { scope: ['profile', 'email'] })
    )

    app.get(
      '/auth/google/callback',
      passport.authenticate('google', {
        session: false,
        failureRedirect: 'https://client492.herokuapp.com/signIn'
      }),
      googleAuth
    )

    app.listen(process.env.PORT || 4000,process.env.LOCAL_ADDRESS, () =>
      console.log(`Server run on http://localhost:4000${server.graphqlPath}`)
    )

  } catch (error) {

    console.log(error)

  }

}



createServer();

