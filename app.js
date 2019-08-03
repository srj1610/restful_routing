var express  =require("express"),
methodOverride=require("method-override"),
mongoose     =require("mongoose"),
bodyParser   =require("body-parser"),
expressSanitizer=require("express-sanitizer"),
app          =express();

mongoose.connect('mongodb://localhost:27017/restful_blog_app', {useNewUrlParser: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema=mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default: Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);
 app.get("/",function(req,res){
     res.redirect("/blogs");
 });
 app.get("/blogs",function(req,res){
     Blog.find({},function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else{
            res.render("index", {blogs: blogs});
        }
     });
 });
 app.get("/blogs/new",function(req,res){
     res.render("new");
 });
app.post("/blogs", function(req, res){
    // create blog
    console.log(req.body);
    
    console.log("===========");
    console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            //then, redirect to the index
            res.redirect("/blogs");
        }
    });
});
// app.get("/blogs/:id",function(req,res){
//     res.send("HELLO I'M BLOG ID");
// });
app.get("/blogs/:id",function(req, res) {
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundBlog});
        }
    });
});
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
           res.render("edit",{blog:foundBlog}); 
        }
    });
});
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
        }else{
           res.redirect("/blogs/"+req.params.id); 
        }
    }); 
});
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});
// Blog.create({
//     title:"blog Test",
//     image:"https://farm2.staticflickr.com/1833/29139749948_a3cd13f49c.jpg",
//     body:"Hello this is a blog post"
// });
                                                                            
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Blog server started!");
});