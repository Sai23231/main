const FrontPage = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}

      {/* Additional FrontPage Section */}
      <div className="w-full bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-pink-600">
              Love That Transcends Time
            </h2>
            <p className="mt-4 text-base md:text-xl text-gray-600 leading-relaxed">
              Love is the thread that weaves our stories together, binding
              hearts across generations. From the wisdom of 50 years to the
              spark of a new journey, every chapter carries a piece of eternity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Grandparents' Love Story */}
            <div className="card relative rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://cdn.pixabay.com/photo/2015/01/29/22/25/old-people-616718_640.jpg"
                alt="Grandparents' Love"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white py-4 text-center">
                <p className="text-lg font-semibold">
                  A Golden Bond of 50 Years
                </p>
                <p className="text-sm">
                  A golden journey of love and commitment that inspires
                  generations.
                </p>
              </div>
            </div>

            {/* Parents' Love Story */}
            <div className="card relative rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://cdn.pixabay.com/photo/2017/07/08/21/30/family-2485714_960_720.jpg"
                alt="Parents' Love"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white py-4 text-center">
                <p className="text-lg font-semibold">
                  A Journey Built on Togetherness
                </p>
                <p className="text-sm">
                  Everyday moments turned into a lifetime of memories.
                </p>
              </div>
            </div>

            {/* New Couple's Story */}
            <div className="card relative rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://cdn.pixabay.com/photo/2018/08/03/04/36/couple-3581038_640.jpg"
                alt="New Couple"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white py-4 text-center">
                <p className="text-lg font-semibold">The Start of Forever</p>
                <p className="text-sm">
                  Every great love story starts with a dream. Let’s create
                  yours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
