import fs from "fs"
import path from "path"
import { ApolloServer } from 'apollo-server-express'

import  resolvers  from './resolvers'
import getUser from './utils/getUser'
import getAdmin from './utils/getAdmin'


const typeDefs = fs
  .readFileSync(path.join(__dirname, "./schema", "schema.graphql"),"utf8")
  .toString()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    context: ({ req }) => {
      const token = req.headers.authorization || ""
  
      // Extract DriverId from token
      const userId = getUser(token)
      const adminId = getAdmin(token)
     

      console.log('User is -->',userId)
      console.log('Admin is -->',adminId)
      
      return { userId,adminId }
    }
  })

export default server;