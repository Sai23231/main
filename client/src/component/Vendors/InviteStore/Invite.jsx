import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const InviteVendor = () => {
  const InviteVendorData = [
    {
      id: 1,
      name: 'Moments By Rj, Mumbai',
      image: 'm12.jpg',
      price: '9500',
      rating: 5.0,
      services: ['Wedding Photographer', 'Videography', 'Editing'],
      link: '/pbooking',
    },
    {
      id: 2,
      name: 'With You Forever Photographer, Mumbai',
      image: 'WFS1.jpeg',
      price: '9500',
      rating: 5.0,
      services: ['Cinematography', 'Videography', 'Editing'],
      link: '/wfsbooking',
    },
    {
      id: 3,
      name: 'NP Studio, Mumbai',
      image: 'np1.png',
      price: '9500',
      rating: 5.0,
      services: ['Wedding Photographer', 'Videography', 'Editing'],
      link: '/',
    },
    // Add more InviteVendor here...
  ];

  return (
    <div className="mx-8">
      <br />
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 InviteVendor:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <NavLink to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
              Home
            </NavLink>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
              <NavLink to="/vendors" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 InviteVendor:ms-2 dark:text-gray-400 dark:hover:text-white">
                Vendors
              </NavLink>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
              <span className="ms-1 text-sm font-medium text-gray-500 InviteVendor:ms-2 dark:text-gray-400">InviteVendor in Mumbai</span>
            </div>
          </li>
        </ol>
      </nav>
      <h1 className="text-3xl font-semibold dark:text-white">InviteVendor in Mumbai</h1>
      <br />
      <div className="grid InviteVendor:grid-cols-3 gap-6 mb-6">
        {InviteVendorData.map((photographer) => (
          <Link key={photographer.id} to={photographer.link} target="_blank" className="relative group flex w-full max-w-[26rem] flex-col rounded-xl bg-gray-100 bg-clip-border text-gray-700 shadow-lg">
            <div className="relative mx-4 mt-4 overflow-hidden text-white shadow-lg rounded-xl bg-blue-gray-500 bg-clip-border shadow-blue-gray-500/40">
              <img src={photographer.image} alt={photographer.name} className="w-full h-64 object-cover" />
              <div className="absolute inset-0 w-full h-full to-bg-black-10 bg-gradient-to-tr from-transparent via-transparent to-black/60"></div>
              <button
                className="!absolute top-4 right-4 h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-full text-center align-middle font-sans text-xs font-medium uppercase text-red-500 transition-all hover:bg-red-500/10 active:bg-red-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path
                      d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-xl font-medium leading-snug text-blue-gray-900">{photographer.name}</h5>
                <p className="flex items-center gap-1.5 text-base font-normal text-blue-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="-mt-0.5 h-5 w-5 text-yellow-300">
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  {photographer.rating.toFixed(1)}
                </p>
              </div>
              <span className="text-base font-medium text-gray-700">Photography Package Price &#x20b9; {photographer.price}</span>
              <br />
              <br />
              {photographer.services.map((service, index) => (
                <span
                  key={index}
                  className="bg-gray-300 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-500 dark:text-gray-300"
                >
                  {service}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InviteVendor;