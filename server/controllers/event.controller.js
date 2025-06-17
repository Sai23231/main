import mongoose from 'mongoose';
import Event from '../models/events.model.js';
import { uploadOnCloudinary, getPublicIdFromUrl, deleteFromCloudinary } from "../utils/cloudinary.js"; // assuming this utility exists

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//When organizer comes on his user-dashboard, he can see all his events by this endpoint
export const getAllUserEvents = async (req, res) => {
  try {
    const organizerId = req.id;
    const events = await Event.find({ organizerId: new mongoose.Types.ObjectId(organizerId) });
    if (events.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const getEventsByType = async (req, res) => {
  try {
    const { eventType } = req.params;
    if (!eventType) {
      return res.status(400).json({ message: "Event type is required" });
    }

    const events = await Event.find({
      eventType: { $regex: new RegExp(`^${eventType}$`, 'i') }
    });

    if (events.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events by type:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// used in event dashboard to show all events by organizer name
export const getEventsByOrganizer = async (req, res) => {
  try {
    const { organizerName } = req.params;
    if (!organizerName) {
      return res.status(400).json({ message: "Organizer name is required" });
    }

    const events = await Event.find({
      organizerName: { $regex: new RegExp(`^${organizerName}$`, 'i') }
    });

    if (events.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events by organizer:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.coverImg) {
      try {
        getPublicIdFromUrl(event.coverImg)
        .then(async(value) => await deleteFromCloudinary(value,"image"))
      } catch (error) {
        console.error('Error deleting cover image from Cloudinary:', error);
      }
    }
    if (event.eventPdf) {
      try {
        getPublicIdFromUrl(event.eventPdf)
        .then(async(value) => await deleteFromCloudinary(value,"raw"))
      } catch (error) { 
        console.error('Error deleting event PDF from Cloudinary:', error);
      }
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }
    const { organizerName, eventName, eventType, description } = req.body;
    if (!organizerName || !eventName || !eventType || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const coverImgFile = req.files?.['CoverImage']?.[0];
    const eventPdfFile = req.files?.['EventPdf']?.[0];
    
    let updatedFields = {
      organizerName,
      eventName,
      eventType,
      description
    };

    if (coverImgFile) {
      const uploadedCoverImg = await uploadOnCloudinary(coverImgFile.path);
      const existingEvent = await Event.findById(eventId);
      if (existingEvent && existingEvent.coverImg) {
        try {
          getPublicIdFromUrl(existingEvent.coverImg)
          .then((value) => deleteFromCloudinary(value,"image"))
        } catch (error) {
          console.error('Error Deleting old image from cloudinary:', error);
        }
      }
      updatedFields.coverImg = uploadedCoverImg.url;
    }

    if (eventPdfFile) {
      const uploadedEventPdf = await uploadOnCloudinary(eventPdfFile.path);
      const existingEvent = await Event.findById(eventId);
      if (existingEvent && existingEvent.eventPdf) {
        try {
          getPublicIdFromUrl(existingEvent.eventPdf)
          .then((value) => deleteFromCloudinary(value,"raw"))
        } catch (error) {
          console.error('Error Deleting old PDF from cloudinary:', error);
        }
      }
      updatedFields.eventPdf = uploadedEventPdf.url;
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedFields, { new: true });
    
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.status(200).json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const createEvent = async (req, res) => {
  try {
    const organizerId = req.id; // Organizer should login and create their own events
    const { organizerName, eventName, eventType, description } = req.body;
    if (!organizerName || !eventName || !eventType || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const coverImgFile = req.files?.['CoverImage']?.[0];
    const eventPdfFile = req.files?.['EventPdf']?.[0];
    if (!coverImgFile || !eventPdfFile) {
        return res.status(400).json({ message: "Both Cover Image and Event PDF are required" });
    }
    const uploadedCoverImg = await uploadOnCloudinary(coverImgFile.path);
    const uploadedEventPdf = await uploadOnCloudinary(eventPdfFile.path);
    const newEvent = new Event({
      organizerId: new mongoose.Types.ObjectId(organizerId),
      organizerName,
      eventName,
      eventType,
      description,
      coverImg: uploadedCoverImg.url,
      eventPdf: uploadedEventPdf.url
    });
    await newEvent.save();
    res.status(201).json({ success: true, event: newEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }   
};
