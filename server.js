const express = require("express"); 
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const db = "mongodb://localhost:27017/DETMES"
const main_route = require("./routes/main_route");

app.use(bodyParser.urlencoded({
    extended: false
 }));
app.use(bodyParser.json()); 
app.get('/',(req,res) =>{
    res.send("hello from server");
})
app.use('/user',main_route);

mongoose.Promise=global.Promise;
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true},(err)=>{
    if(err){
        console.log(err)
    }
    else
    console.log("connected to db")
})
app.listen(process.env.PORT||4000, () => {
  console.log("Server is listening on port: 4000");
});

