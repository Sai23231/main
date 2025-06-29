import { useState } from "react";
import EventBasics from "./EventBasics";
import AddServices from "./AddServices";
import PackageSummary from "./PackageSummary";
import SuggestedCombos from "./SuggestedCombos";

// Example pricing logic (customize as needed)
const SERVICE_PRICES = {
  venue: 25000,
  catering: 800 * 100, // 100 guests default
  decor: 15000,
  photo: 12000,
  // ...
};
const OPTION_PRICES = {
  indoor: 0, outdoor: 0, ac: 2000, parking: 1000, accessible: 500,
  veg: 0, nonveg: 200, dessert: 3000,
  minimal: 0, floral: 3000, neon: 4000, festive: 5000,
  drone: 5000, livestream: 4000, teaser: 3000,
};
const SERVICE_LABELS = {
  venue: "Venue",
  catering: "Catering (100 guests)",
  decor: "Decor",
  photo: "Photography & Videography",
};

export default function CustomPackageBuilder() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    eventType: "",
    dateTime: "",
    location: "",
    guests: 100,
    hasVenue: false,
    services: [],
    serviceOptions: {},
  });
  const [saved, setSaved] = useState(false);
  const [booked, setBooked] = useState(false);

  // Pricing calculation
  const getPricing = () => {
    let breakdown = [];
    let subtotal = 0;
    form.services.forEach(svc => {
      let base = SERVICE_PRICES[svc] || 0;
      // Catering price per guest
      if (svc === "catering") base = 800 * (form.guests || 100);
      // Add options
      let opts = form.serviceOptions[svc] || [];
      let optTotal = opts.reduce((sum, opt) => sum + (OPTION_PRICES[opt] || 0), 0);
      breakdown.push({
        label: SERVICE_LABELS[svc] || svc,
        amount: base + optTotal
      });
      subtotal += base + optTotal;
    });
    const serviceFee = 1999;
    const gst = Math.round((subtotal + serviceFee) * 0.18);
    const total = subtotal + serviceFee + gst;
    return { breakdown, serviceFee, gst, total };
  };
  const pricing = getPricing();

  // Combo handler
  const handleAddCombo = (combo) => {
    // Add combo's services and options
    let newServices = [...form.services];
    let newOptions = { ...form.serviceOptions };
    if (combo.id === "proposal_combo") {
      if (!newServices.includes("decor")) newServices.push("decor");
      if (!newServices.includes("photo")) newServices.push("photo");
      newOptions["decor"] = ["custom"];
      newOptions["photo"] = ["photographer"];
    } else if (combo.id === "wedding_combo") {
      ["venue", "catering", "decor"].forEach(svc => {
        if (!newServices.includes(svc)) newServices.push(svc);
      });
      newOptions["decor"] = ["floral"];
      newOptions["catering"] = ["veg"];
    } else if (combo.id === "photo_booth") {
      if (!newServices.includes("photo")) newServices.push("photo");
      newOptions["photo"] = [...(newOptions["photo"] || []), "booth"];
    } else if (combo.id === "dj_band") {
      if (!newServices.includes("photo")) newServices.push("photo");
      newOptions["photo"] = [...(newOptions["photo"] || []), "dj", "band"];
    }
    setForm(f => ({ ...f, services: newServices, serviceOptions: newOptions }));
  };

  // Save/Book handlers
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const handleBook = () => {
    setBooked(true);
    setTimeout(() => setBooked(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto p-4">
      <div className="flex-1 min-w-0">
        {step === 1 && (
          <EventBasics form={form} setForm={setForm} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <AddServices
            form={form}
            setForm={setForm}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <>
            <SuggestedCombos onAddCombo={handleAddCombo} />
            <div className="flex justify-between mt-6">
              <button
                className="px-6 py-3 border border-gray-300 rounded-xl flex items-center hover:bg-gray-50 text-gray-700 font-medium"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold"
                onClick={() => setStep(4)}
              >
                Next: Review & Book
              </button>
            </div>
          </>
        )}
        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Review & Confirm</h2>
            <PackageSummary
              form={form}
              pricing={pricing}
              onSave={handleSave}
              onBook={handleBook}
            />
            <div className="flex justify-between mt-6">
              <button
                className="px-6 py-3 border border-gray-300 rounded-xl flex items-center hover:bg-gray-50 text-gray-700 font-medium"
                onClick={() => setStep(3)}
              >
                Back
              </button>
            </div>
            {saved && <div className="mt-4 text-green-600 font-bold">Plan saved!</div>}
            {booked && <div className="mt-4 text-blue-600 font-bold">Booking request sent!</div>}
          </div>
        )}
      </div>
      {/* Sidebar summary for desktop */}
      {step !== 4 && (
        <div className="w-full md:w-80">
          <PackageSummary
            form={form}
            pricing={pricing}
            onSave={handleSave}
            onBook={handleBook}
          />
        </div>
      )}
    </div>
  );
} 