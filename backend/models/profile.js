const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const { v4: uuidv4 } = require("uuid");

const profileSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
  },

  name: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

 owner: {
  type: String,
  required: true
}
,
location:{
  type:String,
  required:true
},
phone:{
  type:Number,
},

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  experience: {
  type: Number,
  default: 0
},
skills: {
  type: String,
  default: ""
},
certificate: {
  type: String,
  default: ""
},
rating: {
  type: Number,
  default: 5
},

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

profileSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id: { $in: listing.reviews}
    });
  }
});



const Profile=mongoose.model("Profile",profileSchema);
module.exports=Profile;