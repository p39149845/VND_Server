import jwt from "jsonwebtoken"

const getAdmin = token => {
  if (!token) return null

  // 'Bearer zbowltobla..' -> [Bearer, zobaohooh]
  const parsedToken = token.split(" ")[1]

  try {
    const decodedToken = jwt.verify(parsedToken, process.env.SECRET)

    return decodedToken.adminId
  } catch (error) {
    return null
  }
}

export default getAdmin