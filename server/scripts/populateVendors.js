import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models
import VendorList from '../models/vendor.model.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Function to generate default password
const generateDefaultPassword = () => {
  return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
};

// Sample vendors data
const sampleVendors = [
  {
    name: "Moments By Rj",
    email: "info@momentsbyrj.com",
    password: "vendor123",
    location: "Mumbai",
    type: "photographer",
    description: "Professional wedding photographer based in Mumbai. Specializing in capturing beautiful moments that last a lifetime.",
    CoverImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop",
    rating: "4.5",
    reviews: 25,
    averageRating: 4.5,
    pricing: {
      package: "Wedding Package",
      price: "₹9,500"
    },
    contact: {
      phone: "+91 9876543210",
      email: "info@momentsbyrj.com",
      website: "https://momentsbyrj.com"
    },
    photos: [
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop"
    ],
    services: ["Wedding Photography", "Videography", "Photo Editing", "Album Design"],
    businessDetails: {
      address: "Andheri West, Mumbai, Maharashtra",
      experience: "8+ years",
      teamSize: "5-10",
      languages: ["English", "Hindi", "Marathi"],
      specializations: ["Wedding Photography", "Engagement Shoots", "Pre-wedding"]
    },
    businessHours: {
      monday: "9:00 AM - 7:00 PM",
      tuesday: "9:00 AM - 7:00 PM",
      wednesday: "9:00 AM - 7:00 PM",
      thursday: "9:00 AM - 7:00 PM",
      friday: "9:00 AM - 7:00 PM",
      saturday: "10:00 AM - 6:00 PM",
      sunday: "Closed"
    },
    socialMedia: {
      facebook: "https://facebook.com/momentsbyrj",
      instagram: "https://instagram.com/momentsbyrj",
      twitter: "",
      linkedin: ""
    },
    status: "approved",
    submittedAt: new Date(),
    approvedAt: new Date()
  },
  {
    name: "Elegant Events",
    email: "info@elegantevents.com",
    password: "vendor123",
    location: "Delhi",
    type: "event planner",
    description: "Premier event planning service in Delhi. We specialize in creating unforgettable wedding experiences.",
    CoverImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
    rating: "4.8",
    reviews: 42,
    averageRating: 4.8,
    pricing: {
      package: "Complete Wedding Package",
      price: "₹50,000"
    },
    contact: {
      phone: "+91 9876543211",
      email: "info@elegantevents.com",
      website: "https://elegantevents.com"
    },
    photos: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop"
    ],
    services: ["Wedding Planning", "Venue Selection", "Vendor Coordination", "Day-of Coordination"],
    businessDetails: {
      address: "Connaught Place, Delhi",
      experience: "12+ years",
      teamSize: "15-20",
      languages: ["English", "Hindi", "Punjabi"],
      specializations: ["Wedding Planning", "Corporate Events", "Destination Weddings"]
    },
    businessHours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    socialMedia: {
      facebook: "https://facebook.com/elegantevents",
      instagram: "https://instagram.com/elegantevents",
      twitter: "https://twitter.com/elegantevents",
      linkedin: "https://linkedin.com/company/elegantevents"
    },
    status: "approved",
    submittedAt: new Date(),
    approvedAt: new Date()
  },
  {
    name: "Royal Banquet Hall",
    email: "info@royalbanquet.com",
    password: "vendor123",
    location: "Bangalore",
    type: "banquet hall",
    description: "Luxurious banquet hall in the heart of Bangalore. Perfect venue for your dream wedding.",
    CoverImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
    rating: "4.6",
    reviews: 38,
    averageRating: 4.6,
    pricing: {
      package: "Wedding Reception",
      price: "₹2,500/plate"
    },
    contact: {
      phone: "+91 9876543212",
      email: "info@royalbanquet.com",
      website: "https://royalbanquet.com"
    },
    photos: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop"
    ],
    services: ["Wedding Reception", "Engagement Ceremony", "Corporate Events", "Catering"],
    businessDetails: {
      address: "Indiranagar, Bangalore, Karnataka",
      experience: "15+ years",
      teamSize: "25-30",
      languages: ["English", "Hindi", "Kannada", "Tamil"],
      specializations: ["Wedding Receptions", "Engagement Ceremonies", "Corporate Events"]
    },
    businessHours: {
      monday: "8:00 AM - 11:00 PM",
      tuesday: "8:00 AM - 11:00 PM",
      wednesday: "8:00 AM - 11:00 PM",
      thursday: "8:00 AM - 11:00 PM",
      friday: "8:00 AM - 11:00 PM",
      saturday: "8:00 AM - 11:00 PM",
      sunday: "8:00 AM - 11:00 PM"
    },
    socialMedia: {
      facebook: "https://facebook.com/royalbanquet",
      instagram: "https://instagram.com/royalbanquet",
      twitter: "",
      linkedin: ""
    },
    status: "approved",
    submittedAt: new Date(),
    approvedAt: new Date()
  },
  {
    name: "Melody Makers",
    email: "info@melodymakers.com",
    password: "vendor123",
    location: "Chennai",
    type: "music",
    description: "Professional music band for weddings and events. Creating magical moments with soulful music.",
    CoverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    rating: "4.7",
    reviews: 31,
    averageRating: 4.7,
    pricing: {
      package: "Wedding Music Package",
      price: "₹15,000"
    },
    contact: {
      phone: "+91 9876543213",
      email: "info@melodymakers.com",
      website: "https://melodymakers.com"
    },
    photos: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop"
    ],
    services: ["Live Music", "DJ Services", "Sound System", "Custom Playlists"],
    businessDetails: {
      address: "T Nagar, Chennai, Tamil Nadu",
      experience: "10+ years",
      teamSize: "8-12",
      languages: ["English", "Hindi", "Tamil", "Telugu"],
      specializations: ["Wedding Music", "Reception Music", "Engagement Music"]
    },
    businessHours: {
      monday: "10:00 AM - 8:00 PM",
      tuesday: "10:00 AM - 8:00 PM",
      wednesday: "10:00 AM - 8:00 PM",
      thursday: "10:00 AM - 8:00 PM",
      friday: "10:00 AM - 8:00 PM",
      saturday: "10:00 AM - 8:00 PM",
      sunday: "10:00 AM - 6:00 PM"
    },
    socialMedia: {
      facebook: "https://facebook.com/melodymakers",
      instagram: "https://instagram.com/melodymakers",
      twitter: "https://twitter.com/melodymakers",
      linkedin: ""
    },
    status: "approved",
    submittedAt: new Date(),
    approvedAt: new Date()
  },
  {
    name: "Beauty & Beyond",
    email: "info@beautyandbeyond.com",
    password: "vendor123",
    location: "Hyderabad",
    type: "makeup artist",
    description: "Professional makeup artists specializing in bridal makeup and beauty services.",
    CoverImage: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop",
    rating: "4.9",
    reviews: 67,
    averageRating: 4.9,
    pricing: {
      package: "Bridal Makeup Package",
      price: "₹8,000"
    },
    contact: {
      phone: "+91 9876543214",
      email: "info@beautyandbeyond.com",
      website: "https://beautyandbeyond.com"
    },
    photos: [
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop"
    ],
    services: ["Bridal Makeup", "Hair Styling", "Mehendi Design", "Saree Draping"],
    businessDetails: {
      address: "Banjara Hills, Hyderabad, Telangana",
      experience: "8+ years",
      teamSize: "10-15",
      languages: ["English", "Hindi", "Telugu", "Urdu"],
      specializations: ["Bridal Makeup", "Engagement Makeup", "Reception Makeup"]
    },
    businessHours: {
      monday: "9:00 AM - 7:00 PM",
      tuesday: "9:00 AM - 7:00 PM",
      wednesday: "9:00 AM - 7:00 PM",
      thursday: "9:00 AM - 7:00 PM",
      friday: "9:00 AM - 7:00 PM",
      saturday: "9:00 AM - 7:00 PM",
      sunday: "10:00 AM - 5:00 PM"
    },
    socialMedia: {
      facebook: "https://facebook.com/beautyandbeyond",
      instagram: "https://instagram.com/beautyandbeyond",
      twitter: "",
      linkedin: ""
    },
    status: "approved",
    submittedAt: new Date(),
    approvedAt: new Date()
  }
];

// Function to create vendor
const createVendor = async (vendorData) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(vendorData.password, 10);
    
    // Check if vendor already exists
    const existingVendor = await VendorList.findOne({ 
      $or: [
        { name: vendorData.name },
        { email: vendorData.email }
      ]
    });

    if (existingVendor) {
      console.log(`Vendor already exists: ${vendorData.name}`);
      return {
        name: existingVendor.name,
        email: existingVendor.email,
        status: 'Already exists'
      };
    }

    // Create new vendor
    const newVendor = await VendorList.create({
      ...vendorData,
      password: hashedPassword
    });

    console.log(`✅ Created vendor: ${vendorData.name}`);
    
    return {
      name: vendorData.name,
      email: vendorData.email,
      status: 'Created successfully'
    };

  } catch (error) {
    console.error(`❌ Error creating vendor ${vendorData.name}:`, error);
    return {
      name: vendorData.name,
      email: vendorData.email,
      status: 'Failed',
      error: error.message
    };
  }
};

// Main function to populate vendors
const populateVendors = async () => {
  try {
    await connectDB();

    console.log('🚀 Starting vendor population...');
    console.log(`📝 Found ${sampleVendors.length} vendors to create`);

    const results = [];

    // Process each vendor
    for (const vendor of sampleVendors) {
      const result = await createVendor(vendor);
      results.push(result);
    }

    // Display results
    console.log('\n📋 Vendor Creation Results:');
    console.log('='.repeat(80));
    
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.name} (${result.email}) - ${result.status}`);
    });

    const createdCount = results.filter(r => r.status === 'Created successfully').length;
    const existingCount = results.filter(r => r.status === 'Already exists').length;
    const failedCount = results.filter(r => r.status === 'Failed').length;

    console.log('\n📊 Summary:');
    console.log(`✅ Created: ${createdCount}`);
    console.log(`⚠️  Already exists: ${existingCount}`);
    console.log(`❌ Failed: ${failedCount}`);
    console.log(`📈 Total vendors in database: ${await VendorList.countDocuments()}`);

    console.log('\n🎉 Vendor population completed!');
    
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');

  } catch (error) {
    console.error('❌ Error during vendor population:', error);
    process.exit(1);
  }
};

// Run the script
populateVendors(); 