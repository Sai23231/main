// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const SearchComponent = () => {
//   const [selectedCity, setSelectedCity] = useState("");
//   const [selectedVendorType, setSelectedVendorType] = useState("");
//   const navigate = useNavigate();

//   const handleSearch = () => {
//     // Construct the URL based on the selected options
//     const cityQuery = selectedCity ? `city=${selectedCity}` : '';
//     const vendorQuery = selectedVendorType ? `vendor=${selectedVendorType}` : '';

//     // Create query string
//     const queryString = [cityQuery, vendorQuery].filter(Boolean).join('&');

//     // Redirect to the search results page
//     navigate(`/search-results?${queryString}`);
//   };

//   return (
//     <div className="flex flex-col lg:flex-row justify-center items-center gap-4 p-4">
//       <select
//         className="select w-full lg:w-[200px] text-black select-bordered"
//         onChange={(e) => setSelectedCity(e.target.value)}
//         value={selectedCity}
//       >
//         <option value="" disabled>Select City</option>
//         <option value="">All Cities</option>
//         <option value="Kalwa">Kalwa</option>
//         <option value="Airoli">Airoli</option>
//         <option value="Thane">Thane</option>
//         <option value="Mulund">Mulund</option>
//         <option value="Ghatkopar">Ghatkopar</option>
//         <option value="Dombivli">Dombivli</option>
//       </select>
//       <select
//         className="select w-full lg:w-[200px] text-black select-bordered"
//         onChange={(e) => setSelectedVendorType(e.target.value)}
//         value={selectedVendorType}
//       >
//         <option value="" disabled>Select Vendor Type</option>
//         <option value="">All Categories</option>
//         <option value="Venues">Venues</option>
//         <option value="Photographers">Photographers</option>
//         <option value="Makeup Artist">Makeup Artist</option>
//         <option value="Mehndi Artist">Mehndi Artist</option>
//         <option value="Caterers">Caterers</option>
//         <option value="Decorators">Decorators</option>
//         <option value="Music&Dance Artist">Music & Dance Artist</option>
//         <option value="Pandit">Pandit</option>
//         <option value="Bands">Bands</option>
//       </select>
//       <button
//         className="btn w-full lg:w-auto"
//         onClick={handleSearch}
//       >
//         Search
//       </button>
//     </div>
//   );
// };

// export default SearchComponent;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchComponent = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedVendorType, setSelectedVendorType] = useState("");
  const navigate = useNavigate();

  const handleCityChange = (e) => {
    const city = e.target.value || "Cities";
    setSelectedCity(city);

    if (selectedVendorType) {
      navigate(`/${city}/${selectedVendorType}`);
    }
  };

  const handleVendorTypeChange = (e) => {
    const vendorType = e.target.value || "Categories";
    setSelectedVendorType(vendorType);

    if (selectedCity) {
      navigate(`/${selectedCity}/${vendorType}`);
    }
  };

  // Function to navigate back
  const handleClose = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center gap-2 p-4 relative">
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 bg-pink-600 text-white px-2 py-1 rounded-full hover:bg-pink-800"
        onClick={handleClose}
        aria-label="Close"
      >
        ✕
      </button>

      <select
        className="select w-full lg:w-[100px] bg-slate-100 text-black"
        onChange={handleCityChange}
        value={selectedCity}
      >
        <option value="" disabled>
          {" "}
          Cities
        </option>
        <option value="Cities">All Cities</option>
        <option value="Kalwa">Kalwa</option>
        <option value="Airoli">Airoli</option>
        <option value="Thane">Thane</option>
        <option value="Mulund">Mulund</option>
        <option value="Ghatkopar">Ghatkopar</option>
        <option value="Dombivli">Dombivli</option>
      </select>

      <select
        className="select w-full lg:w-[200px] bg-slate-100 text-black"
        onChange={handleVendorTypeChange}
        value={selectedVendorType}
      >
        <option value="" disabled>
          {" "}
          Vendor Type
        </option>
        <option value="Categories">All Categories</option>
        <option value="Venues">Venues</option>
        <option value="Photographers">Photographers</option>
        <option value="Makeup Artist">Makeup Artist</option>
        <option value="Mehndi Artist">Mehndi Artist</option>
        <option value="Caterers">Caterers</option>
        <option value="Decorators">Decorators</option>
        <option value="Music&Dance Artist">Music & Dance Artist</option>
        <option value="Pandit">Pandit</option>
        <option value="Bands">Bands</option>
      </select>
    </div>
  );
};

export default SearchComponent;
