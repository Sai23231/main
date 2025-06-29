import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  FiX, FiCreditCard, FiDollarSign, FiCheckCircle, 
  FiAlertCircle, FiLoader, FiShield
} from 'react-icons/fi';

const SponsorPayment = ({ proposal, onPaymentSuccess, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    if (!proposal) return;
    
    setIsProcessing(true);
    setError('');
    
    try {
      // Create payment order
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/payment/sponsor/create-order`,
        {
          amount: proposal.amount,
          proposalId: proposal._id,
          eventId: proposal.eventId._id,
          sponsorId: proposal.sponsorId._id
        },
        { withCredentials: true }
      );

      const { order } = orderResponse.data;

      // Initialize Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Dream Ventz",
        description: `Payment for ${proposal.eventId.eventName}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/payment/sponsor/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                proposalId: proposal._id,
                eventId: proposal.eventId._id,
                sponsorId: proposal.sponsorId._id,
                amount: proposal.amount
              },
              { withCredentials: true }
            );

            setSuccess(true);
            setIsProcessing(false);
            
            // Call success callback after a short delay
            setTimeout(() => {
              onPaymentSuccess(verifyResponse.data.payment);
            }, 2000);
          } catch (verifyError) {
            console.error('Payment verification failed:', verifyError);
            setError('Payment verification failed. Please contact support.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: proposal.eventId.organizerName || "Event Organizer",
          email: proposal.eventId.organizerEmail || "",
        },
        theme: {
          color: "#8B5CF6"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment initiation failed:', err);
      setError(err.response?.data?.message || 'Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  const handleBankTransfer = async () => {
    setIsProcessing(true);
    setError('');
    
    try {
      // For bank transfer, we'll create a pending payment record
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/sponsor/process-payment`,
        {
          proposalId: proposal._id,
          eventId: proposal.eventId._id,
          sponsorId: proposal.sponsorId._id,
          organizerId: proposal.eventId.organizerId,
          amount: proposal.amount,
          paymentMethod: 'bank_transfer',
          status: 'pending'
        },
        { withCredentials: true }
      );

      setSuccess(true);
      setIsProcessing(false);
      
      setTimeout(() => {
        onPaymentSuccess(response.data.payment);
      }, 2000);
    } catch (err) {
      console.error('Bank transfer setup failed:', err);
      setError(err.response?.data?.message || 'Failed to setup bank transfer');
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center"
        >
          <div className="mb-4">
            <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600">
              Your payment has been processed successfully. You will receive a confirmation email shortly.
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
            <p className="text-sm text-gray-500">Payment for {proposal?.eventId?.eventName}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isProcessing}
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-lg">₹{proposal?.amount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Event:</span>
              <span>{proposal?.eventId?.eventName}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Sponsor:</span>
              <span>{proposal?.sponsorId?.name}</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                value="razorpay"
                checked={paymentMethod === 'razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
                disabled={isProcessing}
              />
              <div className="flex items-center">
                <FiCreditCard className="mr-2 text-purple-600" />
                <span>Pay with Card/UPI (Razorpay)</span>
              </div>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                value="bank_transfer"
                checked={paymentMethod === 'bank_transfer'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
                disabled={isProcessing}
              />
              <div className="flex items-center">
                <FiDollarSign className="mr-2 text-green-600" />
                <span>Bank Transfer</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={paymentMethod === 'razorpay' ? handlePayment : handleBankTransfer}
            disabled={isProcessing}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <FiLoader className="mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FiShield className="mr-2" />
                Pay Now
              </>
            )}
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <FiShield className="inline mr-1" />
          Your payment is secured with SSL encryption
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SponsorPayment; 