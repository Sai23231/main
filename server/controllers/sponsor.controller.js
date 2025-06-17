import e from 'express';
import Sponsor from '../models/sponsor.model.js';
import mongoose from 'mongoose';

export const getAllSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find();
    res.status(200).json(sponsors);
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// For Event Dashboard
export const getSponsorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
    const sponsor = await Sponsor.findById(id);
    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }
    res.status(200).json(sponsor);
  } catch (error) {
    console.error('Error fetching sponsor:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// When sponsor comes on user dashboard to view their own details
export const getSponsorInfoById = async (req, res) => {
  try {
    const userId = req.id;
    const sponsor = await Sponsor.find({userId: new mongoose.Types.ObjectId(userId)}); // Fetch only specific fields
    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }
    res.status(200).json(sponsor);
  } catch (error) {
    console.error('Error fetching sponsor info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const getSponsorsByIndustry = async (req, res) => {
  try {
    const { industry } = req.params;
    if (!industry) {
      return res.status(400).json({ message: "Industry is required" });
    }

    const sponsors = await Sponsor.find({
      industry: { $regex: new RegExp(`^${industry}$`, 'i') }
    });

    if (sponsors.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(sponsors);
  } catch (error) {
    console.error('Error fetching sponsors by industry:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const getSponsorsByBudget = async (req, res) => {
  try {
    const { budget } = req.params;
    if (!budget) {
      return res.status(400).json({ message: "Budget is required" });
    }
    const sponsors = await Sponsor.find({ budget: { $gte: budget } });  //get all sponsors with budget greater than or equal to the specified budget  
    if (sponsors.length === 0) {
      return res.status(404).json({ message: "No sponsors found with the specified budget" });
    }
    res.status(200).json(sponsors);
  } catch (error) {
    console.error('Error fetching sponsors by budget:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const createSponsor = async (req, res) => {
  try {
    const userId = req.id; // Sponsor should login and create their own details
    const { name, industry, budget } = req.body;

    if (!name || !industry || !budget) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSponsor = new Sponsor({
      userId: new mongoose.Types.ObjectId(userId),
      name,
      industry,
      budget
    });

    await newSponsor.save();
    res.status(201).json(newSponsor);
  } catch (error) {
    console.error('Error creating sponsor:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateSponsor = async (req, res) => {
  try {
    const userId = req.id;   //Sponsor should login and update their own details
    const { name, industry, budget } = req.body;

    if (!name || !industry || !budget) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingSponsor = await Sponsor.findOne({ userId: new mongoose.Types.ObjectId(userId) });

    const updatedSponsor = await Sponsor.findByIdAndUpdate(
      existingSponsor._id,
      { name, industry, budget },
      { new: true }
    );

    if (!updatedSponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    res.status(200).json(updatedSponsor);
  } catch (error) {
    console.error('Error updating sponsor:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteSponsor = async (req, res) => {
  try {
    const userId = req.id; // Sponsor should login and delete themselves
    const deletedSponsor = await Sponsor.findOneAndDelete({userId: new mongoose.Types.ObjectId(userId)});
    if (!deletedSponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    res.status(200).json({ message: "Sponsor deleted successfully" });
  } catch (error) {
    console.error('Error deleting sponsor:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

