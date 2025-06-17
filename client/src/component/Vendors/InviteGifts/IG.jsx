import React from "react";

function InvitationStore() {
  return (
    <div className="container mx-auto p-8 text-center">
      <header className="text-center py-6">
        <h1 className="text-4xl font-bold text-gray-800">Explore E-Invites</h1>
        <p className="text-gray-500">
          Discover personalized invitations for every occasion.
        </p>
      </header>

      <div className="flex justify-center items-center my-20">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Coming Soon!
          </h2>
          <p className="text-gray-500">
            We are working on bringing you an amazing collection of invitation
            cards and videos. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
}

export default InvitationStore;
