import mongoose from 'mongoose';
import Sponsor from './models/sponsor.model.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleSponsors = [
  {
    name: 'TechCorp Solutions',
    industry: 'Technology',
    budget: '₹10,000 - ₹50,000',
    contactEmail: 'sponsorship@techcorp-solutions.com',
    companyDescription: 'Leading technology solutions provider for events and corporate functions. We specialize in providing cutting-edge tech solutions, audio-visual equipment, and digital marketing services for events.',
    website: 'https://techcorp-solutions.com',
    contactPhone: '+91-9876543210',
    address: '123 Tech Street, Bangalore, Karnataka 560001',
    targetAudience: 'Tech professionals, startups, corporate events, IT companies',
    preferredEventTypes: ['corporate', 'wedding', 'graduation'],
    deliverables: [
      {
        type: 'financial',
        description: 'Direct financial sponsorship',
        value: '₹15,000'
      },
      {
        type: 'in-kind',
        description: 'Audio-visual equipment and technical support',
        value: '₹5,000'
      },
      {
        type: 'marketing',
        description: 'Social media promotion and branding',
        value: '₹3,000'
      }
    ],
    sponsorshipLevels: [
      {
        name: 'Platinum Sponsor',
        amount: 25000,
        benefits: [
          'Premium logo placement',
          'Speaking opportunity',
          'VIP access for 10 guests',
          'Branded materials distribution'
        ]
      },
      {
        name: 'Gold Sponsor',
        amount: 15000,
        benefits: [
          'Logo placement',
          'Exhibition space',
          'VIP access for 5 guests'
        ]
      },
      {
        name: 'Silver Sponsor',
        amount: 8000,
        benefits: [
          'Logo placement',
          'Exhibition space'
        ]
      }
    ],
    paymentMethod: 'bank_transfer',
    bankDetails: {
      accountName: 'TechCorp Solutions Pvt Ltd',
      accountNumber: '1234567890',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234'
    },
    adminNotes: 'High-quality technology sponsor with excellent track record',
    isActive: true,
    isVerified: true,
    addedBy: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011') // Placeholder admin ID
  },
  {
    name: 'Fashion Forward',
    industry: 'Fashion',
    budget: '₹5,000 - ₹25,000',
    contactEmail: 'events@fashionforward.com',
    companyDescription: 'Premium fashion brand specializing in wedding and event wear. We provide exclusive fashion collections, styling services, and fashion show coordination.',
    website: 'https://fashionforward.com',
    contactPhone: '+91-9876543211',
    address: '456 Fashion Avenue, Mumbai, Maharashtra 400001',
    targetAudience: 'Wedding planners, fashion events, luxury events, bridal shows',
    preferredEventTypes: ['wedding', 'fashion', 'corporate'],
    deliverables: [
      {
        type: 'in-kind',
        description: 'Wedding and event wear collections',
        value: '₹10,000'
      },
      {
        type: 'services',
        description: 'Fashion styling and consultation',
        value: '₹5,000'
      },
      {
        type: 'marketing',
        description: 'Fashion show coordination',
        value: '₹3,000'
      }
    ],
    sponsorshipLevels: [
      {
        name: 'Fashion Partner',
        amount: 20000,
        benefits: [
          'Exclusive fashion collection showcase',
          'Fashion show coordination',
          'VIP styling consultation',
          'Branded fashion materials'
        ]
      },
      {
        name: 'Style Sponsor',
        amount: 12000,
        benefits: [
          'Fashion collection display',
          'Styling consultation',
          'Branded materials'
        ]
      }
    ],
    paymentMethod: 'bank_transfer',
    bankDetails: {
      accountName: 'Fashion Forward Pvt Ltd',
      accountNumber: '0987654321',
      bankName: 'ICICI Bank',
      ifscCode: 'ICIC0000987'
    },
    adminNotes: 'Premium fashion brand with strong market presence',
    isActive: true,
    isVerified: true,
    addedBy: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011') // Placeholder admin ID
  },
  {
    name: 'Foodie Delights',
    industry: 'Food & Beverage',
    budget: '₹3,000 - ₹20,000',
    contactEmail: 'catering@foodiedelights.com',
    companyDescription: 'Premium catering and food service provider for all types of events. We specialize in wedding catering, corporate events, and special occasion catering.',
    website: 'https://foodiedelights.com',
    contactPhone: '+91-9876543212',
    address: '789 Food Street, Delhi, Delhi 110001',
    targetAudience: 'Wedding planners, corporate events, birthday parties, anniversary celebrations',
    preferredEventTypes: ['wedding', 'birthday', 'corporate', 'anniversary'],
    deliverables: [
      {
        type: 'in-kind',
        description: 'Complete catering services',
        value: '₹8,000'
      },
      {
        type: 'services',
        description: 'Event planning and coordination',
        value: '₹3,000'
      },
      {
        type: 'products',
        description: 'Custom cake and dessert packages',
        value: '₹2,000'
      }
    ],
    sponsorshipLevels: [
      {
        name: 'Culinary Partner',
        amount: 15000,
        benefits: [
          'Complete catering services',
          'Custom menu design',
          'Event coordination',
          'VIP dining experience'
        ]
      },
      {
        name: 'Food Sponsor',
        amount: 8000,
        benefits: [
          'Basic catering services',
          'Menu consultation',
          'Branded food items'
        ]
      }
    ],
    paymentMethod: 'bank_transfer',
    bankDetails: {
      accountName: 'Foodie Delights Catering',
      accountNumber: '1122334455',
      bankName: 'SBI Bank',
      ifscCode: 'SBIN0001122'
    },
    adminNotes: 'Reliable catering service with excellent food quality',
    isActive: true,
    isVerified: true,
    addedBy: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011') // Placeholder admin ID
  }
];

const seedSponsors = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing sponsors
    await Sponsor.deleteMany({});
    console.log('Cleared existing sponsors');

    // Add sample sponsors
    const createdSponsors = await Sponsor.insertMany(sampleSponsors);
    console.log(`✅ Created ${createdSponsors.length} sample sponsors:`);
    
    createdSponsors.forEach(sponsor => {
      console.log(`   - ${sponsor.name} (${sponsor.industry})`);
    });

    console.log('\n🎉 Sample sponsors created successfully!');
    console.log('📋 Next steps:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Login as admin: admin@dreamventz.com / Admin@2024#Secure');
    console.log('3. Navigate to Sponsor Management');
    console.log('4. Verify sponsors are visible to organizers');

  } catch (error) {
    console.error('❌ Error seeding sponsors:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedSponsors(); 