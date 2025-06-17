import mongoose from "mongoose";

const questionnaireSchema = new mongoose.Schema(
  {
    themePreferences: {
      themeColorScheme: { type: String },
      attireStyle: { type: String },
      celebrityTheme: { type: String },
    },
    venuePreferences: {
      venueType: { type: String },
      dreamLocation: { type: String },
      venueAmbience: { type: String },
    },
    ceremonyPreferences: {
      ceremonyType: { type: String },
      customsRituals: { type: String },
    },
    receptionPreferences: {
      receptionType: { type: String },
      guestExperience: { type: String },
    },
    decorPreferences: {
      floralDecor: { type: String },
      decorStyle: { type: String },
    },
    vendorPreferences: {
      vendors: { type: String },
    },
    weddingDetails: {
      idealDate: { type: Date },
      weddingType: { type: String },
      guestCount: { type: String },
      budget: { type: String },
    },
    additionalDetails: {
      specialRequests: { type: String },
      weddingInspiration: { type: String },
    },
  },
  { timestamps: true }
);

const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);

export default Questionnaire;
