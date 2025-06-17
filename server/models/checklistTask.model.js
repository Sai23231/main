import mongoose, { Schema } from 'mongoose';

const checkListTaskSchema = new mongoose.Schema(
  {
    userId: { 
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
    },
    name: { type: String, required: true },
    category: { type: String, required: true },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    completed: { type: Boolean, default: false },
    notes: { type: [String], default: [] },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const ChecklistTask = mongoose.model("ChecklistTask", checkListTaskSchema);
export default ChecklistTask;
