const mongoose = require("mongoose");
const connectDB = async () => {
    try{
        await mongoose.connect("mongodb+srv://Karina:80SIODtrORmL7VP@cluster0.zcjmiuh.mongodb.net/")
        console.log("mongoDB connected");
    }
    catch(error){
        console.log(error);
    }
}; 
module.exports = connectDB