import e from 'express';
import Sponsor from '../models/sponsor.model.js';
import Payment from '../models/Payment.model.js';
import mongoose from 'mongoose';

// Admin: Get all sponsors (for admin dashboard)
export const getAllSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find({ isActive: true })
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(sponsors);
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Public: Get active sponsors for event organizers
export const getActiveSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find({ 
      isActive: true, 
      isVerified: true 
    }).select('-adminNotes -bankDetails -totalSponsoredAmount -totalCommissionPaid -addedBy');
    
    console.log(`Found ${sponsors.length} active and verified sponsors`);
    res.status(200).json(sponsors);
  } catch (error) {
    console.error('Error fetching active sponsors:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin: Get sponsor by ID
export const getSponsorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
    const sponsor = await Sponsor.findById(id)
      .populate('addedBy', 'name email');
    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }
    res.status(200).json(sponsor);
  } catch (error) {
    console.error('Error fetching sponsor:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin: Create new sponsor
export const createSponsor = async (req, res) => {
  try {
    const adminId = req.id; // Admin user ID
    const { 
      name, 
      industry, 
      budget, 
      companyDescription, 
      website, 
      contactEmail, 
      contactPhone, 
      address,
      deliverables,
      preferredEventTypes,
      targetAudience,
      sponsorshipLevels,
      paymentMethod,
      bankDetails,
      adminNotes
    } = req.body;

    if (!name || !industry || !budget || !contactEmail) {
      return res.status(400).json({ message: "Name, industry, budget, and contact email are required" });
    }

    const newSponsor = new Sponsor({
      name,
      industry,
      budget,
      companyDescription: companyDescription || '',
      website: website || '',
      contactEmail,
      contactPhone: contactPhone || '',
      address: address || '',
      deliverables: deliverables || [],
      preferredEventTypes: preferredEventTypes || [],
      targetAudience: targetAudience || '',
      sponsorshipLevels: sponsorshipLevels || [],
      paymentMethod: paymentMethod || 'bank_transfer',
      bankDetails: bankDetails || {},
      adminNotes: adminNotes || '',
      addedBy: new mongoose.Types.ObjectId(adminId),
      isActive: true,
      isVerified: false
    });

    await newSponsor.save();
    res.status(201).json(newSponsor);
  } catch (error) {
    console.error('Error creating sponsor:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin: Update sponsor
export const updateSponsor = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      industry, 
      budget, 
      companyDescription, 
      website, 
      contactEmail, 
      contactPhone, 
      address,
      deliverables,
      preferredEventTypes,
      targetAudience,
      sponsorshipLevels,
      paymentMethod,
      bankDetails,
      adminNotes,
      isActive,
      isVerified
    } = req.body;

    if (!name || !industry || !budget || !contactEmail) {
      return res.status(400).json({ message: "Name, industry, budget, and contact email are required" });
    }

    const updatedSponsor = await Sponsor.findByIdAndUpdate(
      id,
      { 
        name, 
        industry, 
        budget,
        companyDescription: companyDescription || '',
        website: website || '',
        contactEmail,
        contactPhone: contactPhone || '',
        address: address || '',
        deliverables: deliverables || [],
        preferredEventTypes: preferredEventTypes || [],
        targetAudience: targetAudience || '',
        sponsorshipLevels: sponsorshipLevels || [],
        paymentMethod: paymentMethod || 'bank_transfer',
        bankDetails: bankDetails || {},
        adminNotes: adminNotes || '',
        isActive: isActive !== undefined ? isActive : true,
        isVerified: isVerified !== undefined ? isVerified : false
      },
      { new: true }
    ).populate('addedBy', 'name email');

    if (!updatedSponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    res.status(200).json(updatedSponsor);
  } catch (error) {
    console.error('Error updating sponsor:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin: Delete sponsor
export const deleteSponsor = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSponsor = await Sponsor.findByIdAndDelete(id);
    if (!deletedSponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    res.status(200).json({ message: "Sponsor deleted successfully" });
  } catch (error) {
    console.error('Error deleting sponsor:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin: Get sponsors by industry
export const getSponsorsByIndustry = async (req, res) => {
  try {
    const { industry } = req.params;
    if (!industry) {
      return res.status(400).json({ message: "Industry is required" });
    }

    const sponsors = await Sponsor.find({
      industry: { $regex: new RegExp(`^${industry}$`, 'i') },
      isActive: true,
      isVerified: true
    });

    res.status(200).json(sponsors);
  } catch (error) {
    console.error('Error fetching sponsors by industry:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin: Get sponsor statistics
export const getSponsorStats = async (req, res) => {
  try {
    const totalSponsors = await Sponsor.countDocuments();
    const activeSponsors = await Sponsor.countDocuments({ isActive: true });
    const verifiedSponsors = await Sponsor.countDocuments({ isVerified: true });
    
    // Get total sponsored amount
    const totalSponsored = await Sponsor.aggregate([
      { $group: { _id: null, total: { $sum: "$totalSponsoredAmount" } } }
    ]);
    
    // Get total commission
    const totalCommission = await Sponsor.aggregate([
      { $group: { _id: null, total: { $sum: "$totalCommissionPaid" } } }
    ]);

    res.status(200).json({
      totalSponsors,
      activeSponsors,
      verifiedSponsors,
      totalSponsoredAmount: totalSponsored[0]?.total || 0,
      totalCommissionPaid: totalCommission[0]?.total || 0
    });
  } catch (error) {
    console.error('Error fetching sponsor stats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin: Process payment and update sponsor stats
export const processPayment = async (req, res) => {
  try {
    const { 
      proposalId, 
      eventId, 
      sponsorId, 
      organizerId, 
      amount, 
      paymentMethod,
      transactionId,
      bankTransferDetails 
    } = req.body;

    if (!proposalId || !eventId || !sponsorId || !organizerId || !amount) {
      return res.status(400).json({ message: "All payment details are required" });
    }

    // Create payment record
    const payment = new Payment({
      proposalId: new mongoose.Types.ObjectId(proposalId),
      eventId: new mongoose.Types.ObjectId(eventId),
      sponsorId: new mongoose.Types.ObjectId(sponsorId),
      organizerId: new mongoose.Types.ObjectId(organizerId),
      amount,
      paymentMethod,
      transactionId,
      bankTransferDetails,
      status: 'completed',
      paymentDate: new Date()
    });

    await payment.save();

    // Update sponsor stats
    await Sponsor.findByIdAndUpdate(sponsorId, {
      $inc: { 
        totalSponsoredAmount: amount,
        totalCommissionPaid: payment.platformAmount
      }
    });

    res.status(201).json({ 
      message: "Payment processed successfully",
      payment,
      commissionAmount: payment.platformAmount,
      organizerAmount: payment.organizerAmount
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin: Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('proposalId')
      .populate('eventId', 'eventName eventType')
      .populate('sponsorId', 'name industry')
      .populate('organizerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// When sponsor comes on user dashboard to view their own details
export const getSponsorInfoById = async (req, res) => {
  try {
    const userId = req.id;
    const sponsor = await Sponsor.findOne({userId: new mongoose.Types.ObjectId(userId)}); // Fetch only specific fields
    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }
    res.status(200).json(sponsor);
  } catch (error) {
    console.error('Error fetching sponsor info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const getSponsorsByBudget = async (req, res) => {
  try {
    const { budget } = req.params;
    if (!budget) {
      return res.status(400).json({ message: "Budget is required" });
    }
    const sponsors = await Sponsor.find({ 
      budget: { $gte: budget },
      isActive: true
    });  //get all sponsors with budget greater than or equal to the specified budget  
    if (sponsors.length === 0) {
      return res.status(404).json({ message: "No sponsors found with the specified budget" });
    }
    res.status(200).json(sponsors);
  } catch (error) {
    console.error('Error fetching sponsors by budget:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

