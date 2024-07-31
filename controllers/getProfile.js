const UsersCollection = require("../models/profile")

const getProfile = async () => {
      const profile = await UsersCollection.findOne({user : process.env.USER})
      if(profile){
          return profile
      }
      const newProfile = new UsersCollection({
          user : process.env.USER,
          balance : 10.0
      })
     await newProfile.save()
     return newProfile
}

module.exports = getProfile