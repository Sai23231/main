import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function DetailsPage() {
  const location = useLocation();
  const { item } = location.state || {}; // Get the passed item details
  const [form, setForm] = useState({
    initials: "",
    coupleName: "",
    date: "",
    hashtag: "",
    otherChanges: "",
  });

  const [currentStep, setCurrentStep] = useState(2);
  const [clickedButton, setClickedButton] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set initial values based on item details
    if (item) {
      setForm({
        ...form,
        coupleName: item.label, // Set couple name based on selected item
      });
    }
  }, [item]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleButtonClick = (buttonType) => {
    setClickedButton(buttonType);
    if (buttonType === "next" && currentStep < 4) {
      if (currentStep === 2) {
        setCurrentStep((prevStep) => prevStep + 1);
        navigate("/payment"); // Navigate to payment page when on step 3
      } else {
        setCurrentStep((prevStep) => prevStep + 1);
      }
    }
    if (buttonType === "previous" && currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const handlePreviousClick = () => {
    if (currentStep === 1) {
      navigate("/invitecard");
    } else {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const calculateProgress = () => {
    const totalSteps = 4;
    return (currentStep / totalSteps) * 100;
  };

  return (
    <div className="border-2 border-gray-200 bg-white p-6 w-1/2 mx-auto my-8 shadow-lg rounded-lg">
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-pink-500 h-2.5 rounded-full"
            style={{ width: `${calculateProgress()}%` }}
          />
          <div className="flex justify-between mt-2 text-sm text-pink-500 font-bold">
            <div
              className={currentStep >= 1 ? "text-pink-500" : "text-gray-400"}
            >
              Choose Video
            </div>
            <div
              className={currentStep >= 2 ? "text-pink-500" : "text-gray-400"}
            >
              Enter Details
            </div>
            <div
              className={currentStep >= 3 ? "text-pink-500" : "text-gray-400"}
            >
              Complete Payment
            </div>
            <div
              className={currentStep >= 4 ? "text-pink-500" : "text-gray-400"}
            >
              Get Video by 26 Sep, 12 pm
            </div>
          </div>
        </div>

        {/* Main form container */}
        <form className="flex flex-col">
          {item && (
            <div className="mb-10 mt-10">
              <img
                src={item.src} // Assuming item contains an imageUrl property
                alt={item.label} // The name of the item
                className="w-40 h-70 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          {currentStep === 2 && (
            <>
              {/* Initials */}
              <div className="mb-4">
                <label className="block text-lg font-semibold text-gray-800 mb-1">
                  Initials*
                </label>
                <input
                  type="text"
                  name="initials"
                  value={form.initials}
                  onChange={handleChange}
                  maxLength="2"
                  placeholder="AR"
                  className="w-full p-2 border-2 border-gray-300 rounded-md text-gray-900 bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  {2 - form.initials.length} characters left
                </p>
              </div>

              {/* Couple Name */}
              <div className="mb-4">
                <label className="block text-lg font-semibold text-gray-800 mb-1">
                  Couple Name*
                </label>
                <input
                  type="text"
                  name="coupleName"
                  value={form.coupleName}
                  onChange={handleChange}
                  maxLength="100"
                  placeholder="Ridhima & Anshit"
                  className="w-full p-2 border-2 border-gray-300 rounded-md text-gray-900 bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  {100 - form.coupleName.length} characters left
                </p>
              </div>

              {/* Date */}
              <div className="mb-4">
                <label className="block text-lg font-semibold text-gray-800 mb-1">
                  Date*
                </label>
                <input
                  type="text"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  placeholder="Thursday, 25th April 2024"
                  className="w-full p-2 border-2 border-gray-300 rounded-md text-gray-900 bg-gray-50"
                />
              </div>

              {/* Hashtag */}
              <div className="mb-4">
                <label className="block text-lg font-semibold text-gray-800 mb-1">
                  #Hashtag*
                </label>
                <input
                  type="text"
                  name="hashtag"
                  value={form.hashtag}
                  onChange={handleChange}
                  maxLength="50"
                  placeholder="#lovebeginsforRidAnsh"
                  className="w-full p-2 border-2 border-gray-300 rounded-md text-gray-900 bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  {50 - form.hashtag.length} characters left
                </p>
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              className={`px-6 py-3 font-bold text-white rounded-md transition-all ${
                clickedButton === "saveDraft" ? "bg-pink-500" : "bg-gray-600"
              }`}
              onClick={() => handleButtonClick("saveDraft")}
            >
              Save Draft
            </button>

            <button
              type="button"
              className={`px-6 py-3 font-bold text-white rounded-md transition-all ${
                clickedButton === "previous" ? "bg-pink-500" : "bg-gray-600"
              }`}
              onClick={() => {
                handleButtonClick("previous");
                handlePreviousClick();
              }}
            >
              Previous
            </button>

            <button
              type="button"
              className={`px-6 py-3 font-bold text-white rounded-md transition-all ${
                clickedButton === "next" ? "bg-pink-500" : "bg-gray-600"
              }`}
              onClick={() => handleButtonClick("next")}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DetailsPage;
