import mongoose from 'mongoose';

const sponsorSchema = new mongoose.Schema({
  userId: {    //Sponsor will also login as user right..
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  budget: {
    type: String,
    required: true
  }
});

const Sponsor = mongoose.model("Sponsor", sponsorSchema);

export default Sponsor;
