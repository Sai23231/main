import mongoose from "mongoose";
import Volunteer from "../models/volunteer.model.js";

export const createVolunteer = async (req, res) => {
  try {
    const userId = req.id; // Volunteer should be logged in to create a profile
    const { fullName, interests, availability } = req.body;
    // Validate required fields
    if (!fullName || !availability) {
        return res.status(400).json({ message: "Full name and availability are required" });
    }

    // Check if the volunteer already exists
    const existingVolunteer = await Volunteer.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (existingVolunteer) {
        return res.status(400).json({ message: "Volunteer already exists" });
    }
    // Create a new volunteer
    const newVolunteer = new Volunteer({
        userId: new mongoose.Types.ObjectId(userId),
        fullName,
        // interests: interests ? JSON.parse(interests) : [],
        interests: Array.isArray(interests) ? interests : [interests],
        availability
    });
    await newVolunteer.save();
    res.status(201).json({ message: "Volunteer created successfully", volunteer: newVolunteer });
  } catch (error) {
      console.error("Error creating volunteer:", error);
      res.status(500).json({ message: "Internal server error" });
  }
}

export const getUserVolunteerInfoById = async (req, res) => {
  try {
    const userId = req.id; // Volunteer should be logged in to view their profile
    const volunteer = await Volunteer.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    
    res.status(200).json(volunteer);
  } catch (error) {
    console.error("Error fetching volunteer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.status(200).json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getVolunteerById = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    
    if (!volunteerId || !mongoose.isValidObjectId(volunteerId)) {
      return res.status(400).json({ message: "Invalid Volunteer ID" });
    }
    
    const volunteer = await Volunteer.findById(volunteerId);
    
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    
    res.status(200).json(volunteer);
  } catch (error) {
    console.error("Error fetching volunteer by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateVolunteer = async (req, res) => {
  try {
    const userId = req.id; // Volunteer should be logged in to update their profile
    const { fullName, interests, availability } = req.body;

    // Validate required fields
    if (!fullName || !availability) {
      return res.status(400).json({ message: "Full name and availability are required" });
    }

    // Find the volunteer by userId
    const volunteer = await Volunteer.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { fullName, 
        // interests: interests ? JSON.parse(interests) : [], 
        interests: Array.isArray(interests) ? interests : [interests],
        availability },
      { new: true }
    );

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    res.status(200).json({ message: "Volunteer updated successfully", volunteer });
  } catch (error) {
    console.error("Error updating volunteer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteVolunteer = async (req, res) => {
  try {
    const userId = req.id; // Volunteer should be logged in to delete their profile

    // Find and delete the volunteer by userId
    const volunteer = await Volunteer.findOneAndDelete({ userId: new mongoose.Types.ObjectId(userId) });

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    res.status(200).json({ message: "Volunteer deleted successfully" });
  } catch (error) {
    console.error("Error deleting volunteer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getVolunteersByInterest = async (req, res) => {
  try {
    const { interest } = req.params;

    if (!interest) {
      return res.status(400).json({ message: "Interest parameter is required" });
    }

    const volunteers = await Volunteer.find({
      interests: { $regex: new RegExp(`^${interest}$`, 'i') } // case-insensitive match
    });

    if (volunteers.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers by interest:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getVolunteersByAvailability = async (req, res) => {
  try {
    const { availability } = req.params;

    if (!availability) {
      return res.status(400).json({ message: "Availability parameter is required" });
    }

    const volunteers = await Volunteer.find({
      availability: { $regex: new RegExp(`^${availability}$`, 'i') } // case-insensitive match
    });

    if (volunteers.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers by availability:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}