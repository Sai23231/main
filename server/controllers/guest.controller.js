import mongoose from "mongoose";
import Guest from "../models/guest.model.js";

// Get all guests
const getGuests = async (req, res) => {
  try {
    const guests = await Guest.find();
    res.status(200).json(guests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGuestById = async (req,res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) {return res.status(400).json({message: "Guest Not Found"})};
    res.status(200).json(guest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getUserGuests = async (req, res) => {
  try {
    const userId = req.id
    const guests = await Guest.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
    if (!guests) return res.status(404).json({ message: "No guests found" });
    res.status(200).json(guests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new guest
const addGuest = async (req, res) => {
  const { userId, guestName, familyName } = req.body;

  if (!guestName || !familyName) {
    return res.status(400).json({ message: "Guest name and family name are required." });
  }

  try {
    const newGuest = new Guest({ 
      userId: new mongoose.Types.ObjectId(userId),
      guestName, 
      familyName });
    await newGuest.save();
    res.status(201).json(newGuest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addUserGuest = async (req, res) => {
  const { guestName, familyName } = req.body;
  const userId = req.id; // from token

  if (!guestName || !familyName) {
    return res.status(400).json({ message: "Guest name and family name are required." });
  }

  try {
    const newGuest = new Guest({ userId: new mongoose.Types.ObjectId(userId), guestName, familyName });
    await newGuest.save();
    res.status(201).json(newGuest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a guest
const updateGuest = async (req, res) => {
  try {
    const updatedGuest = await Guest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedGuest) return res.status(404).json({ message: "Guest not found" });

    res.json(updatedGuest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a guest
const deleteGuest = async (req, res) => {
  try {
    const deletedGuest = await Guest.findByIdAndDelete(req.params.id);
    if (!deletedGuest) return res.status(404).json({ message: "Guest not found" });

    res.json({ message: "Guest deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle RSVP
const toggleRSVP = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ message: "Guest not found" });

    guest.rsvp = req.body.rsvp;
    guest.rsvpDate = new Date();
    await guest.save();

    res.json(guest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a wish message
const addWishMessage = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ message: "Guest not found" });

    guest.wishMessages.push(req.body.message);
    await guest.save();

    res.json(guest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload photo
const uploadPhoto = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ message: "Guest not found" });

    guest.photos.push(req.body.photoURL);
    await guest.save();

    res.json(guest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
    getGuests,
    addGuest,
    updateGuest,
    deleteGuest,
    toggleRSVP,
    addWishMessage,
    uploadPhoto,
    getGuestById
}