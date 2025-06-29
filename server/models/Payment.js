import mongoose from "mongoose";
const UserPaymentSchema = new mongoose.Schema({
  orderId: String,
  paymentId: String,
  signature: String,
  amount: Number,
  currency: String,
  status: { type: String, default: 'created' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  packageDetails: Object,
  createdAt: { type: Date, default: Date.now }
});
const UserPayment = mongoose.models.UserPayment || mongoose.model('UserPayment', UserPaymentSchema);
export default UserPayment;
