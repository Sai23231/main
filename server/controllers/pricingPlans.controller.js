import Plan from "../models/pricingPlans.model.js";

export const createPricingPlans = async (req, res) => {
  const { plan, eventDate, requirements } = req.body;
  const userId = req.id;
  const userEmail = req.email;
  const userPhoneNumber = req.phoneNumber;

  try {
    // Create a new plan document
    const newPlan = new Plan({
      plan,
      eventDate,
      requirements,
      userName: userEmail,
      phoneNumber: userPhoneNumber,
      userId,
    });

    // Save the document in the database
    await newPlan.save();

    // Respond with success
    res
      .status(200)
      .json({ success: true, message: "Plan submitted successfully!" });
  } catch (error) {
    console.error("Error saving plan:", error);
    res.status(500).json({ message: "Error submitting plan." });
  }
};
