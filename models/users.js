var mongoose=require("mongoose");
var bcrypt=require("bcryptjs");

var Userschema=mongoose.Schema({
    username:{
        type:String,
        index:true
    },
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    }

});
var User=module.exports=mongoose.model("User",Userschema);
module.exports.createUser=function(newuser,callback){
    bcrypt.genSalt(10,function(err,salt){
       bcrypt.hash(newuser.password,salt,function(err,hash){
          newuser.password=hash;
           newuser.save(callback);
       });
    });

}
module.exports.getUserByUserName=function(username,callback){
    var query={username:username};
    User.findOne(query,callback);
}
module.exports.getUserById=function(id,callback){
    User.findById(id,callback);
}
module.exports.comparePassword=function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword,hash,function(err,isMatch){
       if(err) throw err;
        callback(null,isMatch);
    });
}
