import Form from "../models/questionnaire.model.js";

export const questionnaire = async (req, res) => {
  try {
    console.log("Received form data:", req.body);

    // Create a new form entry from the request body
    const formData = new Form(req.body);

    // Log validation errors if any
    const validationError = formData.validateSync();
    if (validationError) {
      console.error("Validation error:", validationError);
      return res.status(400).json({
        message: "Validation error",
        errors: validationError.errors,
      });
    }

    // Save the form data to the database
    const savedForm = await formData.save();
    console.log("Saved form data:", savedForm);

    res.status(201).json({
      message: "Form submitted successfully!",
      data: savedForm,
    });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({
      message: "Server error. Could not submit the form.",
      error: error.message,
    });
  }
};
