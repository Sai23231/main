import React from "react";

const Menu = () => {
  return (
    <div className="container w-10/12 mx-auto p-4">
      <h3 className="text-3xl text-amber-600 font-bold text-center">
        Choose your food menu
      </h3>
      <div className="flex flex-col lg:flex-row-reverse justify-between items-center gap-12 mt-8">
        <div>
          <h1 className="text-3xl font-bold m-4">Appetizers</h1>
          <p>
            Caprese Skewers - Fresh mozzarella, cherry tomatoes, basil, and
            balsamic glaze. Spinach and Artichoke Dip - Creamy dip served with
            tortilla chips and veggies. Mini Quiches - Assorted quiches with
            various fillings. Bruschetta - Toasted baguette slices topped with
            diced tomatoes, garlic, basil, and olive oil.
          </p>
        </div>
        <img
          className="w-[400px] h-[300px]"
          src="https://i.ibb.co/yNtKdmj/saile-ilyas-Siwrp-Bnx-Dww-unsplash.jpg"
          alt=""
        />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-12 mt-8">
        <div>
          <h1 className="text-3xl font-bold m-4">Main Courses</h1>
          <p>
            Grilled Chicken Breast - Tender chicken breast marinated and grilled
            to perfection. Herb-Crusted Salmon - Salmon fillet with a savory
            herb crust. Beef Tenderloin - Sliced beef tenderloin served with a
            red wine reduction. Vegetable Stir-Fry - A medley of fresh
            vegetables sautéed in a flavorful sauce.
          </p>
        </div>
        <img
          className="w-[400px] h-[300px]"
          src="https://i.ibb.co/BP4fhF3/ulysse-pointcheval-a-8-Lx-Evb4k-U-unsplash.jpg"
          alt=""
        />
      </div>
      <div className="flex flex-col lg:flex-row-reverse justify-between items-center gap-12 mt-8">
        <div>
          <h1 className="text-3xl font-bold m-4">side</h1>
          <p>
            Garlic Mashed Potatoes - Creamy mashed potatoes with roasted garlic.
            Roasted Vegetables - Seasonal vegetables roasted to enhance their
            natural flavors. Wild Rice Pilaf - A mix of wild and white rice with
            herbs and spices. Caesar Salad - Romaine lettuce, croutons, parmesan
            cheese, and Caesar dressing..
          </p>
        </div>
        <img
          className="w-[400px] h-[300px]"
          src="https://i.ibb.co/HxyWCVT/angelina-yan-Kv50bgu-Cy-Uw-unsplash.jpg"
          alt=""
        />
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-center gap-12 mt-8">
        <div>
          <h1 className="text-3xl font-bold m-4">Desserts</h1>
          <p>
            Signature Cocktails - Craft cocktails designed to complement your
            event's theme. Wine and Beer - A curated selection of wines and
            craft beers. Non-Alcoholic Options - Refreshing mocktails and soft
            drinks. Coffee and Tea - Freshly brewed coffee and a variety of
            teas.
          </p>
        </div>
        <img
          className="w-[400px] h-[300px]"
          src="https://i.ibb.co/jJwnGNP/jason-leung-f-XAu-CMEYGY4-unsplash.jpg"
          alt=""
        />
      </div>
    </div>
  );
};

export default Menu;
