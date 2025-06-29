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

// Function to create vendor from JSON data
const createVendorFromJson = async (vendorData) => {
  try {
    // Generate default password and hash it
    const defaultPassword = generateDefaultPassword();
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Check if vendor already exists
    const existingVendor = await VendorList.findOne({ 
      $or: [
        { name: vendorData.name },
        { email: vendorData.contact?.email || `info@${vendorData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com` }
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

    // Create vendor data
    const newVendorData = {
      name: vendorData.name,
      email: vendorData.contact?.email || `info@${vendorData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      password: hashedPassword,
      location: vendorData.location,
      type: vendorData.type,
      description: vendorData.description || `${vendorData.name} - Professional service provider`,
      CoverImage: vendorData.CoverImage,
      rating: vendorData.rating || "0.0",
      reviews: vendorData.reviews || 0,
      averageRating: vendorData.averageRating || 0,
      pricing: vendorData.pricing || {
        package: "Standard Package",
        price: "Contact for pricing"
      },
      contact: vendorData.contact || {
        phone: "+91 9876543210",
        email: `info@${vendorData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        website: ""
      },
      photos: vendorData.photos || [],
      services: vendorData.services || ["Professional Service"],
      businessDetails: {
        address: vendorData.location,
        experience: "5+ years",
        teamSize: "5-10",
        languages: ["English", "Hindi"],
        specializations: ["Weddings", "Events"]
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
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: ""
      },
      status: "approved",
      submittedAt: new Date(),
      approvedAt: new Date()
    };

    // Create new vendor
    const newVendor = await VendorList.create(newVendorData);

    console.log(`✅ Created vendor: ${vendorData.name}`);
    
    return {
      name: vendorData.name,
      email: newVendorData.email,
      password: defaultPassword,
      status: 'Created successfully',
      _id: newVendor._id
    };

  } catch (error) {
    console.error(`❌ Error creating vendor ${vendorData.name}:`, error);
    return {
      name: vendorData.name,
      email: vendorData.contact?.email || "N/A",
      status: 'Failed',
      error: error.message
    };
  }
};

// Main function to import vendors
const importVendorsFromJson = async () => {
  try {
    await connectDB();

    // Read vendors.json file
    const vendorsPath = path.join(__dirname, '../../vendors.json');
    const vendorsData = JSON.parse(fs.readFileSync(vendorsPath, 'utf-8'));
    
    console.log('🚀 Starting vendor import from JSON...');
    console.log(`📝 Found ${vendorsData.length} vendors in JSON file`);

    const results = [];
    const credentials = [];

    // Process each vendor
    for (const vendor of vendorsData) {
      if (vendor.name && vendor.name.trim()) {
        const result = await createVendorFromJson(vendor);
        results.push(result);
        
        if (result.status === 'Created successfully') {
          credentials.push({
            name: result.name,
            email: result.email,
            password: result.password,
            loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/vendor-login`
          });
        }
      }
    }

    // Save credentials to file
    const credentialsPath = path.join(__dirname, '../vendor-credentials.json');
    fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2));

    // Display results
    console.log('\n📋 Vendor Import Results:');
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

    if (credentials.length > 0) {
      console.log(`\n📄 Credentials saved to: ${credentialsPath}`);
      console.log('\n🔐 Vendor Credentials:');
      console.log('='.repeat(80));
      
      credentials.forEach((cred, index) => {
        console.log(`\n${index + 1}. ${cred.name}`);
        console.log(`   Email: ${cred.email}`);
        console.log(`   Password: ${cred.password}`);
        console.log(`   Login URL: ${cred.loginUrl}`);
      });
    }

    console.log('\n🎉 Vendor import completed!');
    
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');

  } catch (error) {
    console.error('❌ Error during vendor import:', error);
    process.exit(1);
  }
};

// Run the script
importVendorsFromJson(); 