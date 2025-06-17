import mongoose, { isValidObjectId } from "mongoose";
import EventVolunteer from "../models/eventVolunteer.model.js";
import Event from "../models/events.model.js";
import Volunteer from "../models/volunteer.model.js";

export const assignVolunteerToEvent = async (req, res) => {
  try {
    const { eventId, volunteerId, assignedRole } = req.body;
    // Validate required fields
    if (!eventId || !volunteerId) {
      return res.status(400).json({ message: "Event ID and Volunteer ID are required" });
    }
    if (!isValidObjectId(eventId) || !isValidObjectId(volunteerId)) {
      return res.status(400).json({ message: "Invalid Event ID or Volunteer ID" });
    }
    if (assignedRole && typeof assignedRole !== 'string') {
      return res.status(400).json({ message: "Assigned role must be a string" });
    }

    // Validate event and volunteer existence
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    // Check if volunteer is already assigned to the event
    const existingAssignment = await EventVolunteer.findOne({
      eventId: new mongoose.Types.ObjectId(eventId),
      volunteerId: new mongoose.Types.ObjectId(volunteerId)
    });
    if (existingAssignment) {
      return res.status(400).json({ message: "Volunteer is already assigned to this event" });
    }
    // Create new assignment
    const newAssignment = new EventVolunteer({
      eventId: new mongoose.Types.ObjectId(eventId),
      volunteerId: new mongoose.Types.ObjectId(volunteerId),
      assignedRole: assignedRole || ''
    });
    await newAssignment.save();
    res.status(201).json({ message: "Volunteer assigned to event successfully", assignment: newAssignment });
  } catch (error) {
    console.error("Error assigning volunteer to event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getVolunteersByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;
    // Validate event ID
    if (!eventId || !isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid Event ID" });
    }

    // Validate event existence
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    // Fetch volunteers assigned to the event
    const assignments = await EventVolunteer.find({ eventId: new mongoose.Types.ObjectId(eventId) })
      .populate('volunteerId'); // Populate volunteer details
    if (assignments.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching volunteers by event ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getEventsByVolunteerId = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    // Validate volunteer ID
    if (!volunteerId || !isValidObjectId(volunteerId)) {
      return res.status(400).json({ message: "Invalid Volunteer ID" });
    }

    // Validate volunteer existence
    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    // Fetch events associated with the volunteer
    const assignments = await EventVolunteer.find({ volunteerId: new mongoose.Types.ObjectId(volunteerId) })
      .populate('eventId'); // Populate event details
    if (assignments.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching events by volunteer ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getUserVolunteeredEvents = async (req, res) => {
  try {
    const userId = req.id; // Volunteer should be logged in to view their events
    // Fetch volunteer details
    const volunteer = await Volunteer.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    // Fetch events associated with the volunteer
    const assignments = await EventVolunteer.find({ volunteerId: new mongoose.Types.ObjectId(volunteer._id) })
      .populate('eventId'); // Populate event details
    if (assignments.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching volunteered events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const removeVolunteerFromEvent = async (req, res) => {
  try {
    const { eventId, volunteerId } = req.body;
    // Validate required fields
    if (!eventId || !volunteerId) {
      return res.status(400).json({ message: "Event ID and Volunteer ID are required" });
    }

    // Validate event and volunteer existence
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    // Remove assignment
    const result = await EventVolunteer.deleteOne({
      eventId: new mongoose.Types.ObjectId(eventId),
      volunteerId: new mongoose.Types.ObjectId(volunteerId)
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Volunteer not assigned to this event" });
    }
    res.status(200).json({ message: "Volunteer removed from event successfully" });
  } catch (error) {
    console.error("Error removing volunteer from event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateVolunteerRoleInEvent = async (req, res) => {
  try {
    const { eventId, volunteerId, assignedRole } = req.body;
    // Validate required fields
    if (!eventId || !volunteerId) {
      return res.status(400).json({ message: "Event ID and Volunteer ID are required" });
    }
    if (assignedRole && typeof assignedRole !== 'string') {
      return res.status(400).json({ message: "Assigned role must be a string" });
    }

    // Validate event and volunteer existence
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    // Update assignment role
    const updatedAssignment = await EventVolunteer.findOneAndUpdate(
      { eventId: new mongoose.Types.ObjectId(eventId), volunteerId: new mongoose.Types.ObjectId(volunteerId) },
      { assignedRole: assignedRole || '' },
      { new: true }
    );
    if (!updatedAssignment) {
      return res.status(404).json({ message: "Volunteer not assigned to this event" });
    }
    res.status(200).json({ message: "Volunteer role updated successfully", assignment: updatedAssignment });
  } catch (error) {
    console.error("Error updating volunteer role in event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}