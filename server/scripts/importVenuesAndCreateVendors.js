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
import User from '../models/user.model.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Function to generate unique vendor ID
const generateVendorId = (name) => {
  const timestamp = Date.now().toString(36);
  const nameSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 6);
  return `VEN_${nameSlug}_${timestamp}`;
};

// Function to generate default password
const generateDefaultPassword = () => {
  return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
};

// Function to parse CSV data
const parseCSV = (csvContent) => {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',');
      const row = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index] ? values[index].trim().replace(/"/g, '') : '';
      });
      data.push(row);
    }
  }

  return data;
};

// Function to create vendor from venue data
const createVendorFromVenue = async (venueData) => {
  try {
    // Generate unique vendor ID and credentials
    const vendorId = generateVendorId(venueData.name);
    const defaultPassword = generateDefaultPassword();
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create vendor data
    const vendorData = {
      vendorId: vendorId, // Custom vendor ID for easy reference
      name: venueData.name,
      email: venueData['contact.email'] || `info@${venueData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      password: hashedPassword,
      type: 'Banquet Hall', // Default type for venues
      location: venueData.location,
      description: venueData.description || `${venueData.name} - A beautiful venue for your special events`,
      contact: {
        phone: venueData['contact.phone'] || '+91 9876543210',
        email: venueData['contact.email'] || `info@${venueData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        website: ''
      },
      services: ['Banquet Hall', 'Event Venue', 'Wedding Venue'],
      pricing: {
        package: 'Standard Package',
        price: venueData['price.veg'] ? `₹${venueData['price.veg']}/plate` : 'Contact for pricing'
      },
      businessDetails: {
        address: venueData.location,
        experience: '5+ years',
        teamSize: '10-20',
        languages: ['English', 'Hindi', 'Marathi'],
        specializations: ['Weddings', 'Corporate Events', 'Birthday Parties']
      },
      businessHours: {
        'Monday': '9:00 AM - 10:00 PM',
        'Tuesday': '9:00 AM - 10:00 PM',
        'Wednesday': '9:00 AM - 10:00 PM',
        'Thursday': '9:00 AM - 10:00 PM',
        'Friday': '9:00 AM - 10:00 PM',
        'Saturday': '9:00 AM - 10:00 PM',
        'Sunday': '9:00 AM - 10:00 PM'
      },
      photos: [
        venueData.photos0,
        venueData.photos1,
        venueData.photos2,
        venueData.photos3,
        venueData.photos4,
        venueData.photos5
      ].filter(photo => photo && photo !== ''),
      averageRating: 0,
      totalReviews: 0,
      status: 'approved', // Auto-approve venues from CSV
      submittedAt: new Date(),
      approvedAt: new Date(),
      isClaimed: true,
      claimedBy: venueData.name,
      claimedAt: new Date()
    };

    // Check if vendor already exists
    const existingVendor = await VendorList.findOne({ 
      $or: [
        { vendorId: vendorId },
        { name: venueData.name },
        { email: vendorData.email }
      ]
    });

    if (existingVendor) {
      console.log(`Vendor already exists: ${venueData.name}`);
      return {
        vendorId: existingVendor.vendorId,
        name: existingVendor.name,
        email: existingVendor.email,
        password: 'Already exists'
      };
    }

    // Create new vendor
    const newVendor = await VendorList.create(vendorData);

    console.log(`Created vendor: ${venueData.name} with ID: ${vendorId}`);
    
    return {
      vendorId: vendorId,
      name: venueData.name,
      email: vendorData.email,
      password: defaultPassword,
      _id: newVendor._id
    };

  } catch (error) {
    console.error(`Error creating vendor for ${venueData.name}:`, error);
    return null;
  }
};

// Main function to import venues
const importVenuesAndCreateVendors = async () => {
  try {
    await connectDB();

    // Read CSV file
    const csvPath = path.join(__dirname, '../../client/public/Dream_weds.venues.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    console.log('Reading venue data from CSV...');
    const venues = parseCSV(csvContent);
    console.log(`Found ${venues.length} venues in CSV`);

    const createdVendors = [];
    const credentials = [];

    // Process each venue
    for (const venue of venues) {
      if (venue.name && venue.name.trim()) {
        const vendorResult = await createVendorFromVenue(venue);
        if (vendorResult) {
          createdVendors.push(vendorResult);
          credentials.push({
            vendorId: vendorResult.vendorId,
            name: vendorResult.name,
            email: vendorResult.email,
            password: vendorResult.password,
            loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/vendor-login`
          });
        }
      }
    }

    // Save credentials to file
    const credentialsPath = path.join(__dirname, '../vendor-credentials.json');
    fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2));

    console.log(`\n✅ Successfully created ${createdVendors.length} vendor accounts`);
    console.log(`📄 Credentials saved to: ${credentialsPath}`);
    console.log('\n📋 Vendor Credentials:');
    console.log('='.repeat(80));
    
    credentials.forEach((cred, index) => {
      console.log(`\n${index + 1}. ${cred.name}`);
      console.log(`   Vendor ID: ${cred.vendorId}`);
      console.log(`   Email: ${cred.email}`);
      console.log(`   Password: ${cred.password}`);
      console.log(`   Login URL: ${cred.loginUrl}`);
    });

    console.log('\n🔐 Important Notes:');
    console.log('- Vendors should change their password after first login');
    console.log('- All venues are auto-approved and can start receiving bookings');
    console.log('- Vendor IDs are unique and used for booking references');

  } catch (error) {
    console.error('Error importing venues:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

// Run the import
importVenuesAndCreateVendors(); 