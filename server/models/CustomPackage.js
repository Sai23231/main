import mongoose from "mongoose";
const CustomPackageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageDetails: Object,
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPayment' },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
const CustomPackage = mongoose.models.CustomPackage || mongoose.model('CustomPackage', CustomPackageSchema);
export default CustomPackage; 