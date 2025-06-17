import mongoose, { Schema } from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userId: { 
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  eventName: { type: String, required: true },
  totalBudget: { type: Number, required: true },
  categories: [
    {
      name: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],
});

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;