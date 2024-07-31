const mongoose = require("mongoose")

async function ConnectToMongo(url){
    console.log(url)
    try{
        console.log("Connecting To Mongo...")
        return await mongoose.connect(url)
    } catch (err) {
        console.error("'Error" , err)
        throw err
    }
}

module.exports = ConnectToMongo;
