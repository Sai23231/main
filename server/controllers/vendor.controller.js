import mongoose, { isValidObjectId } from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import VendorList from "../models/vendor.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getAllVendors = async (req, res) => {
    try {
      const {type} = req.params;
      
      console.log('Fetching vendors for type:', type);
      
      if (!type) {
        return res.status(400).json({ 
          success: false,
          error: 'Vendor type is required' 
        });
      }

      // Use case-insensitive search and also check for partial matches
      const vendors = await VendorList.find({
        $or: [
          { type: type.toLowerCase() },
          { type: type.toUpperCase() },
          { type: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() },
          { type: { $regex: type, $options: 'i' } } // Case-insensitive regex search
        ]
      }).select('-password -__v');
      
      console.log(`Found ${vendors.length} vendors for type: ${type}`);
      
      // If no vendors found with exact type match, try to get all vendors and filter client-side
      if (vendors.length === 0) {
        console.log('No vendors found with exact type match, trying broader search...');
        const allVendors = await VendorList.find({}).select('-password -__v');
        console.log(`Total vendors in database: ${allVendors.length}`);
        console.log('Available vendor types:', [...new Set(allVendors.map(v => v.type))]);
        
        // Filter vendors that might match the requested type
        const filteredVendors = allVendors.filter(vendor => 
          vendor.type && 
          (vendor.type.toLowerCase().includes(type.toLowerCase()) ||
           type.toLowerCase().includes(vendor.type.toLowerCase()))
        );
        
        console.log(`Found ${filteredVendors.length} vendors after filtering`);
        
        if (filteredVendors.length > 0) {
          // Format the filtered vendors
          const formattedVendors = filteredVendors.map(vendor => {
            // Ensure we have a proper cover image
            let coverImage = vendor.CoverImage;
            if (!coverImage && vendor.photos && vendor.photos.length > 0) {
              coverImage = vendor.photos[0];
            }
            if (!coverImage) {
              coverImage = 'https://via.placeholder.com/400x300?text=No+Image';
            }

            // Ensure we have proper pricing
            let pricing = vendor.pricing;
            if (!pricing || !pricing.package || !pricing.price) {
              pricing = {
                package: "Standard Package",
                price: "Contact for pricing"
              };
            }

            // Ensure we have proper contact info
            let contact = vendor.contact;
            if (!contact) {
              contact = {
                phone: "Not available",
                email: vendor.email || "Not available",
                website: ""
              };
            }

            // Ensure we have proper services
            let services = vendor.services;
            if (!services || !Array.isArray(services)) {
              services = ["Professional Service"];
            }

            return {
              _id: vendor._id,
              name: vendor.name || "Vendor Name",
              CoverImage: coverImage,
              rating: vendor.rating || "0.0",
              location: vendor.location || "Location not specified",
              type: vendor.type || type,
              pricing: pricing,
              contact: contact,
              photos: vendor.photos || [],
              description: vendor.description || "No description available",
              services: services,
              averageRating: vendor.averageRating || 0,
              reviews: vendor.reviews || 0,
              businessDetails: vendor.businessDetails || {},
              businessHours: vendor.businessHours || {},
              socialMedia: vendor.socialMedia || {},
              status: vendor.status,
              approvedAt: vendor.approvedAt
            };
          });
          
          console.log('Formatted vendors:', formattedVendors.map(v => ({ name: v.name, type: v.type, status: v.status })));
          
          // Return vendors array directly to match client expectations
          res.json(formattedVendors);
          return;
        }
      }
      
      // Format the response to match the specified JSON structure with all necessary fields
      const formattedVendors = vendors.map(vendor => {
        // Ensure we have a proper cover image
        let coverImage = vendor.CoverImage;
        if (!coverImage && vendor.photos && vendor.photos.length > 0) {
          coverImage = vendor.photos[0];
        }
        if (!coverImage) {
          coverImage = 'https://via.placeholder.com/400x300?text=No+Image';
        }

        // Ensure we have proper pricing
        let pricing = vendor.pricing;
        if (!pricing || !pricing.package || !pricing.price) {
          pricing = {
            package: "Standard Package",
            price: "Contact for pricing"
          };
        }

        // Ensure we have proper contact info
        let contact = vendor.contact;
        if (!contact) {
          contact = {
            phone: "Not available",
            email: vendor.email || "Not available",
            website: ""
          };
        }

        // Ensure we have proper services
        let services = vendor.services;
        if (!services || !Array.isArray(services)) {
          services = ["Professional Service"];
        }

        return {
          _id: vendor._id,
          name: vendor.name || "Vendor Name",
          CoverImage: coverImage,
          rating: vendor.rating || "0.0",
          location: vendor.location || "Location not specified",
          type: vendor.type || type,
          pricing: pricing,
          contact: contact,
          photos: vendor.photos || [],
          description: vendor.description || "No description available",
          services: services,
          averageRating: vendor.averageRating || 0,
          reviews: vendor.reviews || 0,
          businessDetails: vendor.businessDetails || {},
          businessHours: vendor.businessHours || {},
          socialMedia: vendor.socialMedia || {},
          status: vendor.status,
          approvedAt: vendor.approvedAt
        };
      });
      
      console.log('Formatted vendors:', formattedVendors.map(v => ({ name: v.name, type: v.type, status: v.status })));
      
      // Return vendors array directly to match client expectations
      res.json(formattedVendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch vendors',
        message: error.message 
      });
    }
  };

// Fetch a single vendor by ID
export const getVendorById = async (req, res) => {
  try {
    const {type ,vendorId} = req.params;
    
    console.log('Fetching vendor by ID:', { vendorId, type });
    
    if (!(vendorId && isValidObjectId(vendorId))) {
      return res.status(400).json({message: "Missing or Invalid Vendor ID"});
    }
    
    // First try to find vendor by ID only (without type filter)
    let vendor = await VendorList.findById(vendorId).select('-password -__v');
    
    if (!vendor) {
      console.log('Vendor not found by ID:', vendorId);
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    console.log('Found vendor:', { name: vendor.name, type: vendor.type, requestedType: type });
    
    // Check if the vendor type matches the requested type (case-insensitive)
    if (vendor.type && type && 
        vendor.type.toLowerCase() !== type.toLowerCase() &&
        !vendor.type.toLowerCase().includes(type.toLowerCase()) &&
        !type.toLowerCase().includes(vendor.type.toLowerCase())) {
      console.log('Vendor type mismatch:', { vendorType: vendor.type, requestedType: type });
      // Still return the vendor even if type doesn't match exactly
      console.log('Returning vendor despite type mismatch');
    }
    
    // Ensure we have a proper cover image
    let coverImage = vendor.CoverImage;
    if (!coverImage && vendor.photos && vendor.photos.length > 0) {
      coverImage = vendor.photos[0];
    }
    if (!coverImage) {
      coverImage = 'https://via.placeholder.com/800x500?text=No+Image';
    }

    // Ensure we have proper pricing
    let pricing = vendor.pricing;
    if (!pricing || !pricing.package || !pricing.price) {
      pricing = {
        package: "Standard Package",
        price: "Contact for pricing"
      };
    }

    // Ensure we have proper contact info
    let contact = vendor.contact;
    if (!contact) {
      contact = {
        phone: "Not available",
        email: vendor.email || "Not available",
        website: ""
      };
    }

    // Ensure we have proper services
    let services = vendor.services;
    if (!services || !Array.isArray(services)) {
      services = ["Professional Service"];
    }
    
    // Format the response to match the specified JSON structure
    const formattedVendor = {
      _id: vendor._id,
      name: vendor.name || "Vendor Name",
      CoverImage: coverImage,
      rating: vendor.rating || "0.0",
      location: vendor.location || "Location not specified",
      type: vendor.type || type,
      pricing: pricing,
      contact: contact,
      photos: vendor.photos || [],
      description: vendor.description || "No description available",
      services: services,
      averageRating: vendor.averageRating || 0,
      reviews: vendor.reviews || 0,
      businessDetails: vendor.businessDetails || {},
      businessHours: vendor.businessHours || {},
      socialMedia: vendor.socialMedia || {},
      status: vendor.status,
      approvedAt: vendor.approvedAt,
      submittedAt: vendor.submittedAt
    };
    
    console.log('Returning formatted vendor:', { name: formattedVendor.name, type: formattedVendor.type });
    res.status(200).json(formattedVendor);
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ error: 'Error fetching vendor' });
  }
};

// Get vendor profile by auth ID (for vendor dashboard)
export const getVendorProfile = async (req, res) => {
  try {
    const vendorId = req.id; // From auth middleware
    
    if (!(vendorId && isValidObjectId(vendorId))) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    const vendor = await VendorList.findById(vendorId);
    
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ success: true, vendor });
  } catch (error) {
    console.error("Error fetching vendor profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update vendor profile
export const updateVendorProfile = async (req, res) => {
  try {
    const vendorId = req.id; // From auth middleware
    const updateData = req.body;

    if (!(vendorId && isValidObjectId(vendorId))) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const vendor = await VendorList.findByIdAndUpdate(
      vendorId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Profile updated successfully",
      vendor 
    });
  } catch (error) {
    console.error("Error updating vendor profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
  
export const createVendor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      businessName,
      description,
      location,
      address,
      businessType,
      services,
      pricing,
      contact,
      businessHours,
      experience,
      teamSize,
      languages,
      specializations,
      socialMedia,
      photos,
      CoverImage
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password || !businessName || !description || !location || !businessType) {
      return res.status(400).json({ 
        success: false,
        message: "Please fill in all required fields" 
      });
    }

    // Check if vendor already exists
    const existingVendor = await VendorList.findOne({ 
      $or: [{ email }, { 'contact.phone': phone }] 
    });
    
    if (existingVendor) {
      return res.status(400).json({ 
        success: false,
        message: "A vendor with this email or phone number already exists" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create vendor with pending status and new format
    const newVendor = await VendorList.create({
      name: businessName,
      email,
      password: hashedPassword,
      location,
      type: businessType.toLowerCase(), // Store as lowercase for consistency
      CoverImage: CoverImage || (photos && photos.length > 0 ? photos[0] : ""), // Use first photo as cover image
      rating: "0.0",
      reviews: 0,
      averageRating: 0,
      pricing: pricing || { package: "Standard Package", price: "Contact for pricing" },
      contact: {
        phone: contact?.phone || phone,
        email: contact?.email || email,
        website: contact?.website || ""
      },
      photos: photos || [],
      description,
      services: services || [],
      // New fields for comprehensive data
      businessDetails: {
        address: address || "",
        experience: experience || "",
        teamSize: teamSize || "",
        languages: languages || [],
        specializations: specializations || []
      },
      businessHours: businessHours || {},
      socialMedia: socialMedia || {},
      // Registration status
      status: "pending",
      submittedAt: new Date(),
      approvedAt: null,
      approvedBy: null
    });

    return res.status(201).json({
      success: true,
      message: "Registration submitted successfully! Please wait for admin approval.",
      vendor: {
        id: newVendor._id,
        name: newVendor.name,
        email: newVendor.email,
        status: newVendor.status
      }
    });

  } catch (error) {
    console.error("Error creating vendor:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};
  
export const getMultipleVendorsById = async (req, res) => {
  try {
    const { type } = req.params;
    if (!type) {
      return res.status(400).json({ message: "Type parameter is required" });
    }

    const { vendorIds } = req.body;
    if (!Array.isArray(vendorIds) || vendorIds.length === 0) {
      return res.status(400).json({ message: "Vendor IDs array is required" });
    }

    // Validate all vendor IDs
    const validVendorIds = vendorIds.filter(id => isValidObjectId(id));
    if (validVendorIds.length !== vendorIds.length) {
      return res.status(400).json({ message: "Some vendor IDs are invalid" });
    }

    const vendors = await VendorList.find({
      _id: { $in: validVendorIds },
      type: type
    });

    res.status(200).json(vendors);
  } catch (error) {
    console.error("Error fetching multiple vendors:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const claimVendor = async (req, res) => {
  try {
    const { vendorId, email, password, businessName, phone } = req.body;

    if (!vendorId || !email || !password || !businessName || !phone) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    const vendor = await VendorList.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ 
        success: false,
        message: "Vendor not found" 
      });
    }

    if (vendor.isClaimed) {
      return res.status(400).json({ 
        success: false,
        message: "This vendor has already been claimed" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update vendor with claim information
    vendor.isClaimed = true;
    vendor.claimedBy = email;
    vendor.claimedAt = new Date();
    vendor.email = email;
    vendor.password = hashedPassword;
    vendor.name = businessName;
    vendor.contact.phone = phone;

    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "Vendor claimed successfully! You can now login with your credentials."
    });

  } catch (error) {
    console.error("Error claiming vendor:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal Server Error" 
    });
  }
};

// Update vendor login to check approval status
export const vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const vendor = await VendorList.findOne({ email });

    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Allow both approved and pending vendors to log in
    // Only reject rejected vendors
    if (vendor.status === "rejected") {
      return res.status(401).json({
        success: false,
        message: "Your registration has been rejected. Please contact support for more information.",
      });
    }

    // Show warning for pending vendors but allow login
    if (vendor.status === "pending") {
      console.log(`Pending vendor ${email} attempting to log in`);
    }

    const isPasswordValid = await bcrypt.compare(password, vendor.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: vendor._id, email: vendor.email, role: "vendor" },
      process.env.ACCESS_TOKEN_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    res.cookie("vendorToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return complete vendor data for dashboard
    const vendorData = {
      id: vendor._id,
      name: vendor.name,
      email: vendor.email,
      type: vendor.type,
      location: vendor.location,
      status: vendor.status,
      description: vendor.description,
      CoverImage: vendor.CoverImage,
      rating: vendor.rating,
      reviews: vendor.reviews,
      averageRating: vendor.averageRating,
      pricing: vendor.pricing,
      contact: vendor.contact,
      photos: vendor.photos,
      services: vendor.services,
      businessDetails: vendor.businessDetails,
      businessHours: vendor.businessHours,
      socialMedia: vendor.socialMedia,
      submittedAt: vendor.submittedAt,
      approvedAt: vendor.approvedAt
    };

    return res.status(200).json({
      success: true,
      message: vendor.status === "pending" 
        ? "Login successful. Your account is pending approval." 
        : "Login successful",
      vendor: vendorData,
    });
  } catch (error) {
    console.error("Vendor login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const vendorLogout = async (req, res) => {
  try {
    res.clearCookie("vendorToken");
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Vendor logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const checkVendorAuth = async (req, res) => {
  try {
    const vendorId = req.id;
    
    if (!vendorId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const vendor = await VendorList.findById(vendorId).select('-password');
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      vendor,
    });
  } catch (error) {
    console.error("Check vendor auth error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getVendorByIdOnly = async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!(vendorId && isValidObjectId(vendorId))) {
      return res.status(400).json({ message: "Missing or invalid Vendor ID" });
    }
    const vendor = await VendorList.findById(vendorId).select('-password -__v');
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    let coverImage = vendor.CoverImage;
    if (!coverImage && vendor.photos && vendor.photos.length > 0) {
      coverImage = vendor.photos[0];
    }
    if (!coverImage) {
      coverImage = 'https://via.placeholder.com/800x500?text=No+Image';
    }
    let pricing = vendor.pricing;
    if (!pricing || !pricing.package || !pricing.price) {
      pricing = {
        package: "Standard Package",
        price: "Contact for pricing"
      };
    }
    let contact = vendor.contact;
    if (!contact) {
      contact = {
        phone: "Not available",
        email: vendor.email || "Not available",
        website: ""
      };
    }
    let services = vendor.services;
    if (!services || !Array.isArray(services)) {
      services = ["Professional Service"];
    }
    const formattedVendor = {
      _id: vendor._id,
      name: vendor.name || "Vendor Name",
      CoverImage: coverImage,
      rating: vendor.rating || "0.0",
      location: vendor.location || "Location not specified",
      type: vendor.type,
      pricing: pricing,
      contact: contact,
      photos: vendor.photos || [],
      description: vendor.description || "No description available",
      services: services,
      averageRating: vendor.averageRating || 0,
      reviews: vendor.reviews || 0,
      businessDetails: vendor.businessDetails || {},
      businessHours: vendor.businessHours || {},
      socialMedia: vendor.socialMedia || {},
      status: vendor.status,
      approvedAt: vendor.approvedAt,
      submittedAt: vendor.submittedAt
    };
    res.status(200).json(formattedVendor);
  } catch (error) {
    console.error("Error fetching vendor by ID only:", error);
    res.status(500).json({ error: 'Error fetching vendor' });
  }
};

export const uploadVendorImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const vendorId = req.id;
    const imageUrl = req.file.path; // This will be the path to the uploaded file

    // Update vendor's cover image
    const vendor = await VendorList.findByIdAndUpdate(
      vendorId,
      { CoverImage: imageUrl },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Error uploading vendor image:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const uploadPortfolioImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images provided",
      });
    }

    const vendorId = req.id;
    const imageUrls = req.files.map(file => file.path);

    // Get current vendor and add new images to portfolio
    const vendor = await VendorList.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Add new images to existing photos array
    const updatedPhotos = [...(vendor.photos || []), ...imageUrls];

    // Update vendor's portfolio
    const updatedVendor = await VendorList.findByIdAndUpdate(
      vendorId,
      { photos: updatedPhotos },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: `${req.files.length} image(s) uploaded successfully`,
      imageUrls: imageUrls,
      totalImages: updatedPhotos.length
    });
  } catch (error) {
    console.error("Error uploading portfolio images:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removePortfolioImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const vendorId = req.id;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    // Get current vendor
    const vendor = await VendorList.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Remove the image from photos array
    const updatedPhotos = vendor.photos.filter(photo => photo !== imageUrl);

    // Update vendor's portfolio
    const updatedVendor = await VendorList.findByIdAndUpdate(
      vendorId,
      { photos: updatedPhotos },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Image removed successfully",
      totalImages: updatedPhotos.length
    });
  } catch (error) {
    console.error("Error removing portfolio image:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
