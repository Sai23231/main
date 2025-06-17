import React, { useState } from "react";

const InvitationStore = [
  { id: 1, name: "Elegant Floral", price: 10, image: "floral.jpg" },
  { id: 2, name: "Modern Minimal", price: 12, image: "minimal.jpg" },
  { id: 3, name: "Classic Traditional", price: 8, image: "traditional.jpg" },
];

export default function InvitationStore() {
  const [cart, setCart] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  const addToCart = (card) => {
    setCart([...cart, { ...card, quantity: 1 }]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-gray-50 min-h-screen p-5">
      <h1 className="text-center text-4xl font-bold mb-10">
        Wedding Invitation Cards
      </h1>

      {/* Card Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {cards.map((card) => (
          <div key={card.id} className="bg-white rounded-lg shadow-lg p-5">
            <img
              src={card.image}
              alt={card.name}
              className="w-full h-64 object-cover rounded-md mb-4 hover:scale-105 transition-transform"
            />
            <h2 className="text-xl font-semibold mb-2">{card.name}</h2>
            <p className="text-gray-500 mb-4">${card.price}</p>
            <button
              onClick={() => addToCart(card)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div className="bg-white rounded-lg shadow-lg p-5">
        <h2 className="text-2xl font-bold mb-5">Your Cart</h2>
        {cart.length > 0 ? (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-4"
            >
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-500">Price: ${item.price}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
}
