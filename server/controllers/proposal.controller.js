import Event from "../models/events.model.js";
import Sponsor from "../models/sponsor.model.js";
import Proposal from "../models/proposal.model.js";
import mongoose, { isValidObjectId } from "mongoose";

export const createProposal = async (req, res) => {
  try {
    const { eventId, sponsorId, amount, message } = req.body;
    if (!eventId || !sponsorId || !amount || !message) {
      return res.status(400).json({ message: 'Event ID, Sponsor ID, Amount and Message are required' });
    }
    const event = await Event.findById(eventId);
    const sponsor = await Sponsor.findById(sponsorId);
    if (!event || !sponsor) {
      return res.status(404).json({ message: 'Event or Sponsor not found' });
    }

    const newProposal = new Proposal({
      eventId: new mongoose.Types.ObjectId(eventId),
      sponsorId: new mongoose.Types.ObjectId(sponsorId),
      amount,
      message,
    });

    await newProposal.save();
    res.status(201).json({ message: 'Proposal created successfully', proposal: newProposal });
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ message: 'Server error while creating proposal' });
  }
};

export const getAllProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find()
      .populate('eventId')     
      .populate('sponsorId');
    if (!proposals || proposals.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ message: 'Server error while fetching proposals' });
  }
};

export const getProposalById = async (req, res) => {
  try {
    const { proposalId } = req.params;
    if (!(proposalId && isValidObjectId(proposalId))) {
      return res.status(400).json({ message: 'Invalid proposal ID' });
    }

    const proposal = await Proposal.findById(proposalId)
      .populate('eventId')
      .populate('sponsorId');
    
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    res.status(200).json(proposal);
  } catch (error) {
    console.error('Error fetching proposal:', error);
    res.status(500).json({ message: 'Server error while fetching proposal' });
  }
}

export const updateProposalStatus = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { status } = req.body;

    if (!(proposalId && isValidObjectId(proposalId))) {
      return res.status(400).json({ message: 'Invalid proposal ID' });
    }

    if (!status || !['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedProposal = await Proposal.findByIdAndUpdate(
    proposalId,
    { status },
    { new: true }
    ).populate('eventId').populate('sponsorId');

    if (!updatedProposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    res.status(200).json({ message: 'Proposal status updated successfully', proposal: updatedProposal });
  } catch (error) {
    console.error('Error updating proposal status:', error);
    res.status(500).json({ message: 'Server error while updating proposal status' });
  }
}

export const deleteProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    if (!(proposalId && isValidObjectId(proposalId))) {
      return res.status(400).json({ message: 'Invalid proposal ID' });
    }

    const deletedProposal = await Proposal.findByIdAndDelete(proposalId);
    if (!deletedProposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    res.status(200).json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    res.status(500).json({ message: 'Server error while deleting proposal' });
  }
};

// For Event Dashboard
export const getProposalsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!(eventId && isValidObjectId(eventId))) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const proposals = await Proposal.find({ eventId: new mongoose.Types.ObjectId(eventId) })
      .populate('sponsorId');

    if (!proposals || proposals.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(proposals);
  } catch (error) {
    console.error('Error fetching proposals by event:', error);
    res.status(500).json({ message: 'Server error while fetching proposals by event' });
  }
};

//For Event Dashboard
export const getProposalsBySponsor = async (req, res) => {
  try {
    const { sponsorId } = req.params;
    if (!(sponsorId && isValidObjectId(sponsorId))) {
      return res.status(400).json({ message: 'Invalid sponsor ID' });
    }

    const proposals = await Proposal.find({ sponsorId: new mongoose.Types.ObjectId(sponsorId) })
      .populate('eventId');

    if (!proposals || proposals.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(proposals);
  } catch (error) {
    console.error('Error fetching proposals by sponsor:', error);
    res.status(500).json({ message: 'Server error while fetching proposals by sponsor' });
  }
};

//When Sponsor comes on his user-dashboard, he can see all his proposal by this endpoint
export const getAllUserProposals = async (req, res) => {
  try {
    const userId = req.id;
    const sponsor = await Sponsor.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!sponsor) {
      return res.status(404).json({ message: 'User is not a Sponsor' });
    }
    const proposals = await Proposal.find({ sponsorId: new mongoose.Types.ObjectId(sponsor._id) })
      .populate('eventId');
    if (!proposals || proposals.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ message: 'Server error while fetching user proposals' });
  }
}

//For Admin Dashboard
export const getAllProposalsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // Normalize input (case-insensitive check, then map to correct case)
    const normalizedStatus = ['Pending', 'Approved', 'Rejected'].find(
      validStatus => validStatus.toLowerCase() === status.toLowerCase()
    );

    if (!normalizedStatus) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const proposals = await Proposal.find({ status: normalizedStatus })
      .populate('eventId')
      .populate('sponsorId');

    res.status(200).json(proposals);
  } catch (error) {
    console.error('Error fetching proposals by status:', error);
    res.status(500).json({ message: 'Server error while fetching proposals by status' });
  }
};

// Sponsor response to proposal
export const respondToProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { response, counterOffer, additionalDetails } = req.body;
    const sponsorId = req.id; // From auth middleware

    if (!(proposalId && isValidObjectId(proposalId))) {
      return res.status(400).json({ message: 'Invalid proposal ID' });
    }

    if (!response) {
      return res.status(400).json({ message: 'Response is required' });
    }

    // Find the proposal
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    // Verify the sponsor is responding to their own proposal
    if (proposal.sponsorId.toString() !== sponsorId) {
      return res.status(403).json({ message: 'You can only respond to your own proposals' });
    }

    // Update proposal with response
    const updatedProposal = await Proposal.findByIdAndUpdate(
      proposalId,
      {
        sponsorResponse: {
          response,
          counterOffer: counterOffer || null,
          additionalDetails: additionalDetails || '',
          respondedAt: new Date()
        },
        status: response === 'accepted' ? 'Approved' : 
               response === 'rejected' ? 'Rejected' : 'Pending'
      },
      { new: true }
    ).populate('eventId').populate('sponsorId');

    res.status(200).json({ 
      message: 'Proposal response submitted successfully', 
      proposal: updatedProposal 
    });
  } catch (error) {
    console.error('Error responding to proposal:', error);
    res.status(500).json({ message: 'Server error while responding to proposal' });
  }
};


