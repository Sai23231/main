import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const PaymentPage = () => {
  const [amount, setAmount] = useState(499); // Dynamic amount if needed
  const [loading, setLoading] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: amount * 100 }), // Amount in paise
      });

      if (!response.ok)
        throw new Error(`Failed with status: ${response.status}`);

      const data = await response.json();
      if (data?.order) handlePaymentVerify(data.order);
      else throw new Error(data?.message || "Unable to create order");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentVerify = (orderData) => {
    if (!window.Razorpay) {
      toast.error("Payment gateway is not available.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Your Company",
      description: "Checkout Payment",
      order_id: orderData.id,
      handler: async (response) => {
        try {
          const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyRes.json();
          if (verifyData?.message) toast.success(verifyData.message);
          else throw new Error("Payment verification failed.");
        } catch (error) {
          console.error(error);
          toast.error("Payment verification failed.");
        }
      },
      theme: { color: "#5f63b8" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Toaster />
      <div className="bg-white p-6 shadow-lg rounded">
        <h1 className="text-xl font-bold mb-3">Checkout</h1>
        <div className="flex justify-between">
          <p>Amount:</p>
          <p>₹{amount}</p>
        </div>
        <button
          onClick={handlePayment}
          disabled={loading}
          className={`mt-4 w-full ${
            loading ? "bg-gray-400" : "bg-blue-500"
          } text-white p-2 rounded`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
