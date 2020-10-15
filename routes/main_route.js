const express = require("express");
const router= express.Router(); 
const User=require("../models/model_user");

router.post("/register",function(req,res){
   
    User.create(req.body,function(err,newlyCreatedUser){
         if (err){
            
             console.log(err);
         }
         else{
             res.send(newlyCreatedUser);
             console.log(newlyCreatedUser);
         } 
     })
 })

 router.get("/dashboard/:id",function(req,res){
    User.findById(req.params.id,function(err,foundCustomer){
          if(err)
          {
              console.log(err);
          }
          else{
              res.json(foundCustomer);
          }
    })
  })

  router.post("/editProfile/:id",function(req,res){
  
      User.findByIdAndUpdate(req.params.id,req.body,function(err){
          if(err){
              console.log(err);
          }else{
              res.send("updated");
          }
      })
  })
  
  //delete route to delete account
  router.delete("/deleteProfile/:id",function(req,res){
      User.findByIdAndRemove(req.params.id,function(err,deleted_customer){
          if(err){
              
              console.log("err is "+err)
          }
          else{
            
                res.send("deleted");
                console.log(deleted_customer)
             
          }
      })
  })
  /// get cart item
  router.get("/getCartItems/:id",function(req,res){
  
    User.findById(req.params.id).populate('cart').exec((err,PopulatedCustomer)=>{
      if(!err)
      {
        console.log(PopulatedCustomer)
        res.json(PopulatedCustomer.cart)
      }
    })
  })
  
  /// add item to cart 
  router.post("/addToCart/:id",function(req,res){
    console.log(req.body);
    User.findByIdAndUpdate(req.params.id,{ $push: { cart:req.body} },function(err){
      if(err){
          // res.redirect("/retailer/get");
          console.log(err);
      }else{
          // res.redirect("/retailer/get");
          res.send("product added to cart");
      }
    })
  })
  
  
  /// clear cart
  
  router.get("/ClearCart/:id",function(req,res){
   
    User.findByIdAndUpdate(req.params.id,{ $set: { cart: []} },function(err){
      if(err){

          console.log(err);
      }else{

          res.send("product removed from cart");
      }
   })
  })

  router.post("/removeFromCart/",function(req,res){
   
   User.findByIdAndUpdate(req.body.account,{ "$pull": { "cart": { "_id": req.body._id } }},function(err){
      if(err){
          
          console.log(err);
      }else{
          // res.redirect("/retailer/get");
          res.send("product removed from cart");
      }
    })
  })
  module.exports = router
  
  