import User from "../models/user"
import Vehicle from "../models/vehicle"
import Request from '../models/request'
import Metadata from '../models/metadata'
import Admin from '../models/admin'
import WorkDay from "../models/workDay"
import Review from '../models/review'

const Query = {
  user: (parent, args, { userId }, info) => {
    // Check if user logged in
    if (!userId) throw new Error("Please log in")

    return User.findById(userId)
      .populate({
        path: "vehicles",
        options: { sort: { vehicleCreatedAt: 'desc' } },
        populate: { path: "user" , populate: { path: "review" }}
      })

      .populate({
        path: "requests"
        , options: { sort: { reqCreatedAt: 'desc' } }
        , populate: { path: "user", populate: { path: "metadata" } }
      })
      .populate({
        path: "requests"
        , options: { sort: { reqCreatedAt: 'desc' } }
        , populate: { path: "targetUser", populate: { path: "metadata" } }
      })
      .populate({
        path: "requests"
        , options: { sort: { reqCreatedAt: 'desc' } }
        , populate: { path: "targetVehicle" }
      })
      .populate({ path: "metadata", populate: { path: "user" } })
      .populate({ path: "metadata", populate: { path: "targetUser" } })
      .populate({ path: "workDay", populate: { path: "user" } })
      .populate({ path: "review", populate: { path: "user" } })
      .populate({ path: "review", populate: { path: "vehicle" } })

  },

  allUser: (parent, args, context, info) => User.find({})
    .populate({
      path: "vehicles",
      options: { sort: { vehicleCreatedAt: 'desc' } },
      populate: { path: "user" }
    })

    .populate({
      path: "requests"
      , options: { sort: { reqCreatedAt: 'desc' } }
      , populate: { path: "user", populate: { path: "metadata" } }
    })
    .populate({
      path: "requests"
      , options: { sort: { reqCreatedAt: 'desc' } }
      , populate: { path: "targetUser", populate: { path: "metadata" } }
    })
    .populate({
      path: "requests"
      , options: { sort: { reqCreatedAt: 'desc' } }
      , populate: { path: "targetVehicle" }
    })
    .populate({ path: "metadata", populate: { path: "user" } })
    .populate({ path: "metadata", populate: { path: "targetUser" } })
    .populate({ path: "review", populate: { path: "user" } })
    .populate({ path: "workDay", populate: { path: "user" } }),

  vehicle: (parent, args, context, info) =>
    Vehicle.findById(args.id)
      .populate({
        path: "user",
        populate: { path: "vehicles" }
      }),
  allVehicle: (parent, args, context, info) => Vehicle.find()
    .populate({ path: "review", populate: { path: "vehicle" } })
    .populate({ path: "requests", populate: { path: "targetVehicle" } })
    .populate({
      path: "user"
      , populate: { path: "workDay" }
    })
    .populate({
      path: "user"
      , populate: { path: "metadata" }
    })
    .populate({
      path: "user"
      , populate: { path: "vehicles" }
    })
    .populate({
      path: "user"
      , populate: { path: "review" , populate: { path: "vehicle" }}
    }),
  allMetadata: (parent, args, context, info) => Metadata.find().populate({
    path: "user",
    populate: { path: "metadata" }
  }),
  allReview: (parent, args, context, info) => Review.find()
    .populate({
      path: "user",
      populate: { path: "review" }
    })
    .populate({
      path: "vehicle",
      populate: { path: "review" }
    }),
  allRequest: (parent, args, context, info) => Request.find({})
    .populate({
      path: "user",
      populate: { path: "metadata", populate: { path: "user" } },
    })
    .populate({
      path: "targetUser",
      populate: { path: "metadata", populate: { path: "targetUser" } },
    })
    .populate({
      path: "targetVehicle",
      populate: { path: "vehicle" },
    })
  ,

  admin: (parent, args, { adminId }, info) => {
    // Check if user logged in
    if (!adminId) throw new Error("Please log in")
    return Admin.findById(adminId)
  },
  allWorkDay: (parent, args, context, info) => WorkDay.find().populate({
    path: "user",
    populate: { path: "workDay" }
  }),

}

export default Query