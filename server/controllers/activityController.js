import Activity from "../models/Activity.js";

// Get recent activity logs
export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 }).limit(10);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Save user activity
export const logActivity = async (req, res) => {
  try {
    const { userId, page } = req.body;
    if (!userId || !page)
      return res.status(400).json({ message: "Missing data" });

    const newActivity = new Activity({ userId, page });
    await newActivity.save();
    res.status(201).json({ message: "Activity logged" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
