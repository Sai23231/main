import Razorpay from "razorpay";
import UserPayment from "../models/UserPayment.js";
import crypto from "crypto";
import RazorpayPayment from "../models/Payment.js";

// Hardcoded Razorpay credentials to fix the payment error permanently
const razorpay = new Razorpay({
  key_id: "rzp_live_vSIIcoD2YTD6Jh",
  key_secret: "0bxilg33EIr9xoNBrt4NY9s1"
});

export const createOrder = async (req, res) => {
  const { amount, currency = 'INR', packageDetails, userId } = req.body;
  try {
    const options = { amount: amount * 100, currency, receipt: `rcpt_${Date.now()}` };
    const order = await razorpay.orders.create(options);
    const payment = await UserPayment.create({
      orderId: order.id,
      amount,
      currency,
      user: userId,
      packageDetails
    });
    res.json({ orderId: order.id, amount, currency, key: "rzp_live_vSIIcoD2YTD6Jh" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  const { orderId, paymentId, signature } = req.body;
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto.createHmac('sha256', "0bxilg33EIr9xoNBrt4NY9s1")
    .update(body.toString()).digest('hex');
  if (expectedSignature === signature) {
    await UserPayment.findOneAndUpdate({ orderId }, { paymentId, signature, status: 'advance_paid' });
    res.json({ success: true });
    } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const payments = await RazorpayPayment.find();
    res.status(200).json({ data: payments });
  } catch (error) {
    console.error("Failed to fetch payment details:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Sponsor payment functions
export const createSponsorPaymentOrder = async (req, res) => {
  try {
    const { amount, proposalId, eventId, sponsorId } = req.body;
    const organizerId = req.id; // From auth middleware

    if (!amount || !proposalId || !eventId || !sponsorId) {
      return res.status(400).json({ 
        success: false,
        message: "Amount, proposal ID, event ID, and sponsor ID are required" 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid amount" 
      });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `sponsor_payment_${Date.now()}`,
      notes: {
        proposalId,
        eventId,
        sponsorId,
        organizerId
      }
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      order,
      message: "Sponsor payment order created successfully"
    });
  } catch (error) {
    console.error("Sponsor payment order creation failed:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error!" 
    });
  }
};

export const verifySponsorPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      proposalId,
      eventId,
      sponsorId,
      amount
    } = req.body;
    const organizerId = req.id; // From auth middleware

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required payment fields" 
      });
    }

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", "0bxilg33EIr9xoNBrt4NY9s1")
      .update(sign.toString())
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid payment signature" 
      });
    }

    // Calculate platform commission (10% for example)
    const platformCommission = amount * 0.1;
    const organizerAmount = amount - platformCommission;

    // Create payment record
    const payment = new UserPayment({
      proposalId,
      eventId,
      sponsorId,
      organizerId,
      amount,
      platformAmount: platformCommission,
      organizerAmount,
      paymentMethod: "razorpay",
      status: "completed",
      transactionId: razorpay_payment_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentDate: new Date()
    });

    await payment.save();

    res.status(200).json({
      success: true,
      message: "Sponsor payment verified successfully",
      payment: {
        id: payment._id,
        amount: payment.amount,
        platformAmount: payment.platformAmount,
        organizerAmount: payment.organizerAmount,
        status: payment.status
      }
    });
  } catch (error) {
    console.error("Sponsor payment verification failed:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error!" 
    });
  }
};

// Payment history functions
export const getOrganizerPayments = async (req, res) => {
  try {
    const organizerId = req.id; // From auth middleware

    const payments = await UserPayment.find({ organizerId })
      .populate('proposalId')
      .populate('eventId', 'eventName eventType')
      .populate('sponsorId', 'name industry')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments
    });
  } catch (error) {
    console.error("Failed to fetch organizer payments:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error!" 
    });
  }
};

export const getSponsorPayments = async (req, res) => {
  try {
    const { sponsorId } = req.params;

    if (!sponsorId) {
      return res.status(400).json({ 
        success: false,
        message: "Sponsor ID is required" 
      });
    }

    const payments = await UserPayment.find({ sponsorId })
      .populate('proposalId')
      .populate('eventId', 'eventName eventType')
      .populate('organizerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments
    });
  } catch (error) {
    console.error("Failed to fetch sponsor payments:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error!" 
    });
  }
};

