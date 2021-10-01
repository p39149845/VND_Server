import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import User from "../models/user"
import Vehicle from "../models/vehicle"
import Request from '../models/request'
import Metadata from '../models/metadata'
import Review from '../models/review'
import Admin from '../models/admin'
import WorkDay from '../models/workDay'

const Mutation = {
  signup: async (parent, args, context, info) => {
    // Trim and lower case email
    const email = args.email.trim().toLowerCase()

    // Check if email already exist in database
    const currentUsers = await User.find({})
    const isEmailExist = currentUsers.findIndex(user => user.email === email) > -1

    if (isEmailExist) {
      throw new Error("Email already exist.")
    }

    // Validate password
    if (args.password.trim().length < 6) {
      throw new Error("Password must be at least 6 characters.")
    }

    const password = await bcrypt.hash(args.password, 10)

    return User.create({ ...args, email, password })
  },
  signupDriver: async (parent, args, context, info) => {
    // Trim and lower case email
    const email = args.email.trim().toLowerCase()

    // Check if email already exist in database
    const currentUsers = await User.find({})
    const isEmailExist = currentUsers.findIndex(user => user.email === email) > -1

    if (isEmailExist) {
      throw new Error("Email already exist.")
    }

    // Validate password
    if (args.password.trim().length < 6) {
      throw new Error("Password must be at least 6 characters.")
    }

    const password = await bcrypt.hash(args.password, 10)

    return User.create({ ...args, email, password })
  },

  signupAdmin: async (parent, args, context, info) => {
    // Trim and lower case email
    const email = args.email.trim().toLowerCase()

    // Check if email already exist in database
    const currentUsers = await Admin.find({})
    const isEmailExist = currentUsers.findIndex(admin => admin.email === email) > -1

    if (isEmailExist) {
      throw new Error("Email already exist.")
    }
    // Validate password
    if (args.password.trim().length < 6) {
      throw new Error("Password must be at least 6 characters.")
    }

    const password = await bcrypt.hash(args.password, 10)

    return Admin.create({ ...args, email, password })
  },


  login: async (parent, args, context, info) => {
    const { email, password } = args

    const user = await User.findOne({ email })
      .populate({ path: "vehicles", populate: { path: "user" } })
      .populate({ path: "requests", populate: { path: "targetUser" } })
      .populate({ path: "metadata", populate: { path: "user" } })
      .populate({ path: "workDay", populate: { path: "user" } })
    if (!user) throw new Error("User not found")

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) throw new Error("Invalid email or password.")

    const token = jwt.sign({ userId: user.id }, process.env.SECRET, {
      expiresIn: "7days"
    })

    return { user, jwt: token }
  },

  loginAdmin: async (parent, args, context, info) => {
    const { email, password } = args

    const admin = await Admin.findOne({ email })
    if (!admin) throw new Error("admin not found")

    const validPassword = await bcrypt.compare(password, admin.password)
    if (!validPassword) throw new Error("Invalid email or password.")

    const token = jwt.sign({ adminId: admin.id }, process.env.SECRET, {
      expiresIn: "7days"
    })

    return { admin, jwt: token }
  },

  createRequest: async (parent, args, { userId }, info) => {
    if (!userId) throw new Error("Please log in.")

    if (
      !args.id ||
      !args.country ||
      !args.startDate ||
      !args.stopDate ||
      !args.numberPeople ||
      !args.locationDescription ||
      !args.startLocation
    ) {
      throw new Error("Please provide all required fields.")
    }

    const reqUser = await Request.create({ ...args, user: userId, targetUser: args.id , targetVehicle: args.vehicleId})

    const user = await User.findById(userId)
    const targetUser = await User.findById(args.id)
    const targetVehicle = await Vehicle.findById(args.vehicleId)

    if (!user.requests) {
      user.requests = [reqUser]
      targetUser.requests = [reqUser]
      targetVehicle.requests = [reqUser]

    } else {
      user.requests.push(reqUser)
      targetUser.requests.push(reqUser)
      targetVehicle.requests.push(reqUser)
    }

    await targetUser.save()
    await user.save()
    await targetVehicle.save()

    return Request.findById(reqUser.id)
    .populate({
      path: "user",
      populate: { path: "requests" }
    })
    .populate({
      path: "targetUser",
      populate: { path: "requests" }
    })
    .populate({
      path: "targetVehicle",
      populate: { path: "requests" }
    })
  },

  createDriverMetadata: async (parent, args, { userId }, info) => {
    if (!userId) throw new Error("Please log in.")

    if (!args.image || !args.idCard || !args.driverlicense || !args.gender
      || !args.idCardIm || !args.driverlicenseIm || !args.dateOfBirth) {
      throw new Error("Please provide all required fields.")
    }

    const meta = await Metadata.create({ ...args, user: userId })
    const user = await User.findById(userId)

    if (user.metadata.length >= 1) {
      throw new Error('YOU ALREADY VERIFILING')
    } else {
      if (!user.metadata) {
        user.metadata = [meta]
      } else {
        user.metadata.push(meta)
      }
    }
    await user.save()

    return Metadata.findById(meta.id).populate({
      path: "user",
      populate: { path: "metadata" }
    })
  },

  createVehicle: async (parent, args, { userId }, info) => {
    if (!userId) throw new Error("Please log in.")

    if (!args.description ||
      !args.price ||
      !args.imageUrl ||
      !args.country ||
      !args.numberPeople
    ) {
      throw new Error("Please provide all required fields.")
    }

    const vehicle = await Vehicle.create({ ...args, user: userId })
    const user = await User.findById(userId)

    if (!user.vehicles) {
      user.vehicles = [vehicle]
    } else {
      user.vehicles.push(vehicle)
    }

    await user.save()

    return Vehicle.findById(vehicle.id).populate({
      path: "user",
      populate: { path: "vehicles" }
    })
  },

  updateVehicle: async (parent, args, { userId }, info) => {
    const { id, description, price, imageUrl, country, numberPeople, typeSeat, foodDrink, space, karaoke, tv, gps } = args
    const vehicle = await Vehicle.findById(id)

    if (!userId) throw new Error("Please log in.")

    if (vehicle == null) {
      throw new Error("THIS vehicle DOES NOT EXIST")
    }

    const updateInfo = {
      description: !!description ? description : vehicle.description,
      price: !!price ? price : vehicle.price,
      imageUrl: !!imageUrl ? imageUrl : vehicle.imageUrl,
      country: !!country ? country : vehicle.country,
      numberPeople: !!numberPeople ? numberPeople : vehicle.numberPeople,
      typeSeat: !!typeSeat ? typeSeat : vehicle.typeSeat,
      foodDrink: !!foodDrink ? foodDrink : vehicle.foodDrink,
      space: !!space ? space : vehicle.space,
      karaoke: !!karaoke ? karaoke : vehicle.karaoke,
      tv: !!tv ? tv : vehicle.tv,
      gps: !!gps ? gps : vehicle.gps,
    }

    await Vehicle.findByIdAndUpdate(id, updateInfo)

    const updatedVehicle = await Vehicle.findById(id).populate({
      path: "user",
      populate: { path: "vehicles" }
    })

    return updatedVehicle
  },
  deleteVehicle: async (parent, args, { userId }, info) => {
    const { id } = args
    const vehicle = await Vehicle.findById(id)
    const user = await User.findById(userId)

    if (vehicle == null || user == null) {
      throw new Error("USER OR vehicle DOES NOT EXIST")
    }

    if (vehicle.user.toString() !== userId) {
      throw new Error("YOU ARE NOT AUTHORIZED.")
    }

    // Delete vehicle
    const deletedVehicle = await Vehicle.findByIdAndRemove(id)

    // Update user
    const updatedUservehicle = user.vehicles.filter(
      vehicleId => vehicleId.toString() !== deletedVehicle.id.toString()
    )

    await User.findByIdAndUpdate(userId, { carts: updatedUservehicle })

    return deletedVehicle;
  },


  updateForAdmin: async (parent, args, { adminId }, info) => {
    const { id, status } = args
    const meta = await Metadata.findById(id)

    if (!adminId) throw new Error("Please log in.")

    if (meta == null) {
      throw new Error("THIS MATADATA DOES NOT EXIST")
    }

    const updateInfo = {
      status: !!Boolean ? status : meta.status,
    }

    await Metadata.findByIdAndUpdate(id, updateInfo)

    const updatedMetadata = await Metadata.findById(id).populate({
      path: "user",
      populate: { path: "metadatas" }
    })

    return updatedMetadata
  },

  updateRequest: async (parent, args, { userId }, info) => {
    const { id, status } = args
    const req = await Request.findById(id)

    if (!userId) throw new Error("Please log in.")

    if (req == null) {
      throw new Error("THIS REQUEST DOES NOT EXIST")
    }

    const updateInfo = {
      status: !!status ? status : req.status,
    }

    await Request.findByIdAndUpdate(id, updateInfo)

    const updatedRequest = await Request.findById(id).populate({
      path: "user",
      populate: { path: "request" }
    })

    return updatedRequest
  },
  createWorkDay: async (parent, args, { userId }, info) => {
    if (!userId) throw new Error("Please log in.")

    if (!args.date
    ) {
      throw new Error("Please provide all required fields.")
    }

    const day = await WorkDay.create({ ...args, user: userId })
    const user = await User.findById(userId)

    if (!user.workDay) {
      user.workDay = [day]
    } else {
      user.workDay.push(day)
    }

    await user.save()

    return WorkDay.findById(day.id).populate({
      path: "user",
      populate: { path: "workDay" }
    })
  },
  createReview: async (parent, args, { userId }, info) => {
    if (!userId) throw new Error("Please log in.")

    const review = await Review.create({ ...args, user: args.id, vehicle:args.vehicleId})
    const user = await User.findById(args.id)
    const vehicle = await Vehicle.findById(args.vehicleId)

    if (!user.review) {
      user.review = [review]
      vehicle.review = [review]
    } else {
      user.review.push(review)
      vehicle.review.push(review)
    }

    await user.save()
    await vehicle.save()
  
    return Review.findById(review.id)
    .populate({
      path: "user",
      populate: { path: "review" }
    })
    .populate({
      path: "vehicle",
      populate: { path: "review" }
    })
  },
}

export default Mutation