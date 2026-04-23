const port=4000;
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const multer=require("multer");
const path=require("path");
const cors=require("cors");
const Profile=require("./models/profile.js");

app.use(express.json());
app.use(cors());


//Database Connection with MongoDB
mongoose.connect("mongodb+srv://rakeshmundel000_db_user:lukDyMAU0PfUkmlo@skilhirehub.eimjdvo.mongodb.net/?appName=SkilHireHub")

//API Creation
app.get("/",(req,res)=>{
    res.send("Express App is running");
})

const storage=multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload=multer({storage:storage})

//Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('profile'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

app.post('/addprofile',async (req,res)=>{
    const profile=new Profile({
        name:req.body.name,
    image:req.body.image,
    category:req.body.category,
    description:req.body.description,
    skills:req.body.skills,
    experience:req.body.experience,
    certificate:req.body.certificate,
    location:req.body.location,
    owner: req.body.owner,
    phone:req.body.phone
  });
  console.log(profile);
  await profile.save();
  console.log("Saved");
  res.json({
    success:true,
    name:req.body.name,
  
    })
})

app.post('/removeprofile', async (req, res) => {
  await Profile.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({
    success: true,
    name: req.body.name
  });
});

//Creating API for getting all products
app.get('/allprofiles',async(req,res)=>{
    let profiles=await Profile.find({});
    console.log("All Profiles Fetched");
    res.send(profiles);
})


//creating endpoint for new Collection data
/*app.get('/newcollection',async(req,res)=>{
    let products=await Product.find({});
    let newcollection=products.slice(1).slice(-8);
    console.log ("new Collection fetched");
    res.send(newcollection);
})
*/
//creating endpoint for the popular in women Category
app.get('/topprofessional',async(req,res)=>{
    let profiles=await Profile.find({});
    let top_professional=profiles.slice(0,9);
    console.log ("Top Professional fetched");
    res.send(profiles);
})

app.get("/search", async (req, res) => {
  const query = req.query.query;   // ✅ THIS LINE WAS MISSING

  if (!query) {
    return res.json([]);
  }

  const profiles = await Profile.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
      { skills: { $regex: query, $options: "i" } }
    ]
  });

  res.json(profiles);
});



// get listing
app.get("/propage/:id", async (req, res) => {
  const profile = await Profile.findById(req.params.id);
  res.json(profile);
});

// update listing
app.put("/updateprofile/:id", async (req, res) => {
  await Profile.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
});

 

app.listen(port,(error)=>{
    if(!error){
        console.log("Server is running on port "+port);
    }
    else{
        console.log("Error:"+error);
    }
});