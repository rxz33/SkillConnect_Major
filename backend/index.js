require("dotenv").config();
const port = process.env.PORT || 4000;
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const multer=require("multer");
const path=require("path");
const cors=require("cors");
const Profile=require("./models/profile.js");
const Hiring = require("./models/hiring.js");
const https = require("https");

// Keep-Alive logic for Render (pings every 10 minutes)
const RENDER_URL = process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL;
if (RENDER_URL) {
  setInterval(() => {
    https.get(RENDER_URL, (res) => {
      // Ping successful
    }).on('error', (err) => {
      // Error ignored
    });
  }, 10 * 60 * 1000); // 10 minutes
}

app.use(express.json());
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174', // Just in case
  'https://skillconnect-frontend-static.onrender.com'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


//Database Connection with MongoDB
mongoose.connect(process.env.MONGODB_URI)

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
        image_url:`/images/${req.file.filename}`
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
  await profile.save();
  res.json({
    success:true,
    name:req.body.name,
  
    })
})

app.post('/removeprofile', async (req, res) => {
  await Profile.findOneAndDelete({ id: req.body.id });
  res.json({
    success: true,
    name: req.body.name
  });
});

//Creating API for getting all products
app.get('/allprofiles',async(req,res)=>{
    let profiles=await Profile.find({});
    res.send(profiles);
})


//creating endpoint for new Collection data
/*app.get('/newcollection',async(req,res)=>{
    let products=await Product.find({});
    let newcollection=products.slice(1).slice(-8);
    res.send(newcollection);
})
*/
//creating endpoint for the popular in women Category
// Optimized endpoint for homepage (projection reduces payload size)
app.get('/topprofessional', async (req, res) => {
  try {
    const top_professional = await Profile.find({})
      .select('name image category location rating skills experience certificate phone owner price')
      .limit(9);
    res.send(top_professional);
  } catch (error) {
    res.status(500).send({ message: "Error fetching professionals" });
  }
});

app.get("/search", async (req, res) => {
  const query = req.query.query;

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



// get listing - handles both MongoDB _id and custom UUID id
app.get("/propage/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let profile = null;
    
    // Try finding by MongoDB _id first if it's a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      profile = await Profile.findById(id);
    }
    
    // If not found, try finding by custom 'id' field (UUID)
    if (!profile) {
      profile = await Profile.findOne({ id: id });
    }
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Category endpoint - case-insensitive
app.get("/profiles/category/:category", async (req, res) => {
  try {
    const profiles = await Profile.find({ 
      category: { $regex: new RegExp(`^${req.params.category}$`, 'i') } 
    });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update listing
app.put("/updateprofile/:id", async (req, res) => {
  await Profile.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
});

 

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Payment Session Creation
app.post("/create-checkout-session", async (req, res) => {
  const { profileId, name, price, userId } = req.body;
  // Use the origin from the request to support both local and production
  const origin = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      metadata: {
        profileId,
        userId,
        professionalName: name,
        price,
        scheduledDate: req.body.scheduledDate,
        scheduledTime: req.body.scheduledTime
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Hiring ${name}`,
            },
            unit_amount: price * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/#/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#/cancel`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve session details
app.get("/retrieve-session/:sessionId", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to record hiring after success
app.post("/record-hiring", async (req, res) => {
  const { userId, profileId, professionalName, amount, scheduledDate, scheduledTime } = req.body;
  try {
    const newHiring = new Hiring({
      userId,
      profileId,
      professionalName,
      amount,
      scheduledDate,
      scheduledTime
    });
    await newHiring.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get hired professionals for a user
app.get("/hired-professionals/:userId", async (req, res) => {
  try {
    const hired = await Hiring.find({ userId: req.params.userId });
    res.json(hired);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to check if a professional is already hired by a user
app.get("/check-hiring/:userId/:profileId", async (req, res) => {
  try {
    const hired = await Hiring.findOne({ userId: req.params.userId, profileId: req.params.profileId });
    res.json({ isHired: !!hired });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed endpoint for demo data
app.get('/seed', async (req, res) => {
  const demoProfiles = [
    {
      name: "Alex Johnson",
      image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400",
      category: "Plumber",
      description: "Expert plumber with 10 years of experience in leak repairs and installations.",
      owner: "admin_seed_1",
      location: "San Francisco, CA",
      phone: 1234567890,
      price: 45,
      skills: "Pipe Fitting, Leak Detection, Solar Water Heater",
      experience: 10,
      certificate: "Licensed Master Plumber"
    },
    {
      name: "Sarah Chen",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      category: "Software Developer",
      description: "Full-stack developer specializing in React, Node.js, and scaling web applications.",
      owner: "admin_seed_2",
      location: "Seattle, WA",
      phone: 2345678901,
      price: 85,
      skills: "React, MongoDB, Node.js, AWS",
      experience: 6,
      certificate: "AWS Certified Developer"
    },
    {
      name: "Michael Smith",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      category: "Electrician",
      description: "Residential electrician focused on smart home installations and power upgrades.",
      owner: "admin_seed_3",
      location: "Austin, TX",
      phone: 3456789012,
      price: 60,
      skills: "Smart Home, Wiring, Circuit Repair",
      experience: 8,
      certificate: "Journeyman Electrician"
    }
  ];

  try {
    await Profile.deleteMany({ owner: { $regex: 'admin_seed' } }); // Clean old seed data
    await Profile.insertMany(demoProfiles);
    res.json({ message: "Database seeded successfully with 3 profiles!", count: demoProfiles.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend in production (frontend is deployed separately as static site)
// This code is kept for local development only
if (process.env.NODE_ENV === "production" && process.env.SERVE_FRONTEND === "true") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(port,(error)=>{
    if(error){
        // No log as requested
    }
});