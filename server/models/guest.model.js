import mongoose, {Schema} from "mongoose";

const guestSchema = new Schema(
    {
        userId: { 
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        guestName: { 
            type: String, 
            required: true 
        },
        familyName: {
            type: String,
            required: true 
        },
        rsvp: {
            type: Boolean,
            default: null
        },
        familyMembers: { 
            type: Number, 
            default: 1 
        },
        wishMessages: { 
            type: [String], 
            default: [] 
        },
        photos: { 
            type: [String], 
            default: [] 
        },
        rsvpDate: { 
            type: Date, 
            default: null 
        },
        createdAt: { 
            type: Date, 
            default: Date.now 
        }
});

const Guest = mongoose.model("Guest", guestSchema);

export default Guest;
