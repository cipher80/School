const mongoose = require("mongoose")

const connectDatabase = ()=>{

    mongoose.connect('mongodb://127.0.0.1:27017/schoolApp',{
     useNewUrlParser:true,
     useUnifiedTopology:true
    }).then(()=>console.log('db is connected...')).catch((e)=>console.log(e.message))
}

module.exports = connectDatabase