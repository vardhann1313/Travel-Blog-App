require('dotenv').config()
const mongoose = require('mongoose')

const mongo_url = process.env.connectionString

if(!mongo_url){
    console.log("Incorrect Mongo URL : " + mongo_url)
}else{
    mongoose.connect(mongo_url).then(() => {
        console.log("Database connected !")
    }).catch((err) => {
        console.log(`Error occured !`)
    console.log(err)
    })
}