var express=require("express");
var path=require("path");
var cookieParser=require("cookie-parser");
var bodyParser=require("body-parser");
var expressValidator=require("express-validator");
var session=require("express-session");
var exphbs=require("express-handlebars");
var flash=require("connect-flash");
var passport=require("passport");
var mongo=require("mongodb");
var mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1/loginapp");
var db=mongoose.connection;

var routes=require("./routes/index");
var users=require("./routes/users");

//init app
var app=express();

//view engine
app.set("views",path.join(__dirname,"views"));
app.engine("handlebars",exphbs({defaultLayout:"layout"}));
app.set("view engine","handlebars");

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//static folder
app.use(express.static(path.join(__dirname,"public")));

//Express session middleware
app.use(session({
    secret:"secret",
    saveUninitialized:true,
    resave:true
}));

//Passport initialize
app.use(passport.initialize());
app.use(passport.session());

//Express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

//connect flash
app.use(flash());

//Global variables
app.use(function(req,res,next){
    res.locals.success_msg=req.flash("success_msg");
    res.locals.error_msg=req.flash("error_msg");
    res.locals.error=req.flash("error");
    res.locals.user=req.user||null;
    next();
});

app.use("/",routes);
app.use("/users",users);

//set port
app.set("port",(process.env.PORT||3000));

app.listen(app.get("port"),function(){
   console.log("Server running on port"+app.get("port"));
});

