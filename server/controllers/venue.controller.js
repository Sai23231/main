import Venue from "../models/Venue.model.js";
import Review from "../models/Review.model.js";
import mongoose from "mongoose";
import { isValidObjectId } from "mongoose";

// Get all venues
export const getVenues = async (req, res) => {
  try {
    // const venues = await Venue.find();
    const venues = await Venue.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          location: 1,
          pax: 1,
          guests: 1,
          price: 1,
          rentPrice: 1,
          coverImgSrc: 1,
          // detailUrl: 1,
          averageRating: 1
        }
      }
    ])
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
};

// Get reviews for a venue
export const getVenueReviews = async (req, res) => {
  try {
    const { venueId } = req.params;
    const reviews = await Review.find({ venueId: new mongoose.Types.ObjectId(venueId) });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

//Add Review //Its for loggedIn user
export const addReview = async (req, res) => {    
  try {
    const { venueId } = req.params;
    // const { userId, rating, comment } = req.body;
    const { rating, comment } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if venue exists
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    const newReview = await Review.create({
      venueId: venueId,
      // userId: userId,
      rating: rating,
      comment: comment
    })

    // Update Average Rating
    const reviews = await Review.find({ venueId:venueId });
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    venue.averageRating = averageRating.toFixed(1); // Round to 1 decimal place
    await venue.save();

    res.status(201).json({ message: "Review added successfully", newReview, updatedRating: venue.averageRating });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error });
  }
};

//Its for Dashboard, currently use postman to create venues
// export const addVenue = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       location,
//       pax,
//       guests,
//       capacity,
//       price,
//       rentPrice,
//       coverImgSrc,
//       contact,
//       photos,
//       categories,
//       services,
//       policies,
//       mapEmbedUrl,
//       // detailUrl
//     } = req.body;

//     // Validate required fields
//     if (
//       !name || !location || !pax || !guests || !capacity?.seating || !capacity?.maxCapacity ||
//       !price?.veg || !rentPrice || !coverImgSrc || !contact?.phone || !mapEmbedUrl
//     ) {
//       return res.status(400).json({message: "All Fields are Required"});
//     }

//     // Creating new venue instance
//     const newVenue = await Venue.create({
//       name:name,
//       description:description,
//       location:location,
//       pax:pax,
//       guests:guests,
//       capacity:capacity,
//       price:price,
//       rentPrice:rentPrice,
//       coverImgSrc:coverImgSrc,
//       contact:contact,
//       photos:photos,
//       categories:categories,
//       services:services,
//       policies:policies,
//       mapEmbedUrl:mapEmbedUrl,
//       // detailUrl:detailUrl,
//     });

//     res.status(200).json(newVenue);

//   } catch (error) {
//     console.error("Error adding venue:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const addVenue = async (req, res) => {
  try {
    let {
      name,
      description,
      location,
      pax,
      guests,
      capacity,
      price,
      rentPrice,
      contact,
      categories,
      services,
      policies,
      mapEmbedUrl,
    } = req.body;

    const parseJSONField = (field, fieldName) => {
      try {
        return JSON.parse(field);
      } catch (err) {
        throw new Error(`Invalid JSON in field: ${fieldName}`);
      }
    };
    
    try {
      capacity = parseJSONField(req.body.capacity, 'capacity');
      price = parseJSONField(req.body.price, 'price');
      contact = parseJSONField(req.body.contact, 'contact');
      categories = parseJSONField(req.body.categories, 'categories');
      services = parseJSONField(req.body.services, 'services');
      policies = parseJSONField(req.body.policies, 'policies');
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
    

    // Validate required fields
    if (
      !name || !location || !pax || !guests ||
      !capacity?.seating || !capacity?.maxCapacity ||
      !price?.veg || !rentPrice ||
      !contact?.phone || !contact?.email ||
      !mapEmbedUrl
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Handle cover image upload
    const coverImageFile = req.files?.['coverImgSrc']?.[0];
    let uploadedCoverImg = null;

    if (coverImageFile) {
      uploadedCoverImg = await uploadOnCloudinary(coverImageFile.path);
    } else {
      return res.status(400).json({ message: "Cover image is required." });
    }

    // Handle photos upload
    const photoFiles = req.files?.['photos'] || [];
    const uploadedPhotos = [];

    for (const photo of photoFiles) {
      const uploaded = await uploadOnCloudinary(photo.path);
      uploadedPhotos.push(uploaded.url); // or secure_url if you prefer
    }

    // Create and save new venue
    const newVenue = await Venue.create({
      name,
      description,
      location,
      pax,
      guests,
      capacity,
      price,
      rentPrice,
      coverImgSrc: uploadedCoverImg.url,
      contact,
      photos: uploadedPhotos,
      categories,
      services,
      policies,
      mapEmbedUrl,
    });

    return res.status(201).json(newVenue);

  } catch (error) {
    console.error("Error adding venue:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getVenueDetails = async (req,res) => {
  try {
    const { venueId } = req.params;
    if (!(venueId && isValidObjectId(venueId))) {return res.status(400).json({message: "Missing Venue ID"})}

    const venue = await Venue.aggregate([
      {
        $match : {
          _id: new mongoose.Types.ObjectId(venueId)
        }
      }, 
      {
        $project: {
          name: 1,
          description: 1,
          location: 1,
          capacity: 1,
          price: 1,
          rentPrice: 1,
          contact: 1,
          photos: 1,
          categories: 1, 
          services: 1,
          policies:1,
          mapEmbedUrl: 1
        }
      }
    ])
    if (!venue) {return res.status(400).json({message: "Venue Not Found"})}
    res.status(200).json(venue[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}