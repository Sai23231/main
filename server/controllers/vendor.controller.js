import mongoose, { isValidObjectId } from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import VendorList from "../models/vendor.model.js";

export const getAllVendors = async (req, res) => {
    try {
      const {type} = req.params;
      const vendors = await VendorList.find({type:type});
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch vendors' });
    }
  };

  // Fetch a single vendor by ID
export const getVendorById = async (req, res) => {
  try {
    const {type ,vendorId} = req.params;
    
    if (!(vendorId && isValidObjectId(vendorId))) {return res.status(400).json({message: "Missing Vendor ID"})};
    const vendor = await VendorList.find(
      {
        _id: new mongoose.Types.ObjectId(vendorId),
        type: type
      }
    );
    
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.status(200).json(vendor[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching vendor' });
  }
};
  
export const createVendor = async (req, res) => {  //Atharva
  try {
    console.log('Request Body:', req.body); // Logs text fields
    console.log('Request Files:', req.files); // Logs files received
    let {
      name,
      location,
      type,
      pricing,
      contact,
      description,
      services
    } = req.body;

    const parseJSONField = (field, fieldName) => {
      try {
        return JSON.parse(field);
      } catch (err) {
        throw new Error(`Invalid JSON in field: ${fieldName}`);
      }
    };

    try {
      pricing = parseJSONField(req.body.pricing, 'pricing');
      contact = parseJSONField(req.body.contact, 'contact');
      services = parseJSONField(req.body.services, 'services');
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    // Validate required fields
    if (
      !name ||
      !location ||
      !type ||
      !pricing?.package || 
      !pricing?.price ||
      !contact?.phone ||
      !description
    ) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    let uploadedCoverImg = null;
    try {
      const coverImageFile = req.files?.['CoverImage']?.[0];
      if (coverImageFile) {
        uploadedCoverImg = await uploadOnCloudinary(coverImageFile.path);
      } else {
        return res.status(400).json({ message: "Cover image is required." });
      }
    } catch (err) {
      console.error("Error uploading CoverImage:", err);
      return res.status(400).json({ message: "Error with CoverImage upload", error: err.message });
    }

    const uploadedPhotos = [];
    try {
      const photoFiles = req.files?.['photos'] || [];
      for (const photo of photoFiles) {
        const uploaded = await uploadOnCloudinary(photo.path);
        uploadedPhotos.push(uploaded.url);
      }
      if (uploadedPhotos.length === 0) {
        return res.status(400).json({ message: "At least one photo is required." });
      }
    } catch (err) {
      console.error("Error uploading photos:", err);
      return res.status(400).json({ message: "Error with photos upload", error: err.message });
    }

    // Create and save new vendor
    const newVendor = await VendorList.create({
      name,
      CoverImage: uploadedCoverImg.url,
      rating: "", // If rating will be added later
      location,
      type,
      pricing,
      contact,
      photos: uploadedPhotos,
      description,
      services,
    });

    return res.status(201).json(newVendor);

  } catch (error) {
    console.error("Error creating vendor:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
  
export const getMultipleVendorsById = async (req, res) => {
  try {
    const { type } = req.params;
    if (!type) {
      return res.status(400).json({ message: "Vendor type is required" });
    }
    const { vendorIds } = req.body;
    
    //minimum 2 and maximum 4 vendor IDs are required
    if (
      !vendorIds ||
      !Array.isArray(vendorIds) ||
      vendorIds.length < 2 ||
      vendorIds.length > 4
    ) {
      return res.status(400).json({
        message: "Provide between 2 to 4 vendor IDs"
      });
    }

    const vendors = await VendorList.find({
      _id: { $in: vendorIds.map(id => new mongoose.Types.ObjectId(id)) },
      type: { $regex: `^${type}$`, $options: 'i' } // Case-insensitive match
    });

    if (vendors.length === 0) {
      return res.status(404).json({ message: "No vendors found for the provided IDs" });
    }

    res.status(200).json(vendors);
  } catch (error) {
    console.error("Error fetching multiple vendors:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
