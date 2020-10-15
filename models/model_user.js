const mongoose =require('mongoose');
const Schema=mongoose.Schema;
const userSchema = new Schema({
       _id: {type:String,required:true},
       name:{type:String,required:true},
       contact:{type:Number,required:true},
       address:{type:String,required:true},
       cart:[{
          _id:{type:String},
          pname:{type:String},
          owner:{type:String},
          price:{type:Number}

       }],

});
module.exports=mongoose.model('User',userSchema);