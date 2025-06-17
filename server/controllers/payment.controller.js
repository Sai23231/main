import Razorpay from "razorpay";
import crypto from "crypto";
import "dotenv/config";
import Payment from "../models/Payment.js";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createOrder = async (req, res) => {
  const { amount } = req.body;

  // Validate the amount
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    const options = {
      amount: amount * 100, // Amount in smallest currency unit (paise for INR)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  // Validate the incoming data
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Concatenate the order_id and payment_id to create the sign string
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    // Generate expected signature using HMAC
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    // Compare the expected signature with the received signature
    const isAuthentic = expectedSign === razorpay_signature;

    if (isAuthentic) {
      // Create and save the payment record if the signature matches
      const payment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      await payment.save();

      res.json({
        message: "Payment Successfully Verified",
      });
    } else {
      // Handle invalid signature
      res.status(400).json({ message: "Invalid Signature" });
    }
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json({ data: payments });
  } catch (error) {
    console.error("Failed to fetch payment details:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
