const express =require("express");
const mongoose = require("mongoose");
const app=express();
mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1",{
    useNewUrlParser:true, useUnifiedTopology:true
})
const ShortUrl=require("./Models/ShortUrl");

app.set("view engine","ejs");
app.use(express.static("view"));
app.use(express.urlencoded({extended:true}));

app.get("/",async (req,res)=>{
    const shortUrls=await ShortUrl.find();
    res.render(__dirname + "/view/index.ejs",{shortUrls:shortUrls});
});

app.post("/ShortUrls",async(req,res)=>{
    await ShortUrl.create({full:req.body.fullURL});
    res.redirect("/");
});

app.get("/:shUrl",async(req,res)=>{
    const urlFinded=await ShortUrl.findOne({short:req.params.shUrl});
    if(!urlFinded) res.sendStatus(404);
    urlFinded.clicks++;
    urlFinded.save();
    res.redirect(urlFinded.full);
});

app.listen(process.env.PORT || 3000,()=>{
    console.log("the server is live at http://localhost:3000/");
})
