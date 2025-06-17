import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ReviewSection = ({ entityId, type }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    content: "",
    images: [],
  });
  // const [imagePreview, setImagePreview] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = async () => {
    try {
      let response;
      if (type === 'venue') {
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/review/getVenueReviewsById/${entityId}?page=${page}`, {withCredentials: true}
        );
      } else if (type === 'vendor') {
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/review/getVendorReviewsById/${entityId}?page=${page}`, {withCredentials: true}
        );
      }
      setReviews(response.data.reviews);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleAddReview = async () => {
    try {
      const formData = new FormData();
      Object.keys(newReview).forEach((key) => {
        if (key === "images") {
          newReview.images.forEach((image) => formData.append("images", image));
        } else {
          formData.append(key, newReview[key]);
        }
      });
      formData.append("type", type);
      formData.append("entityId", entityId);

      if (type === 'venue') {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/review/addVenueReview/${entityId}`, {rating: newReview.rating, comment: newReview.content }, {withCredentials: true}
        );
        const { data } = response;
        if (data.success) {
          toast.success("Venue review added successfully!");
        } else {
          toast.error("Failed to add venue review.");
        }
      } else if (type === 'vendor') {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/review/addVendorReview/${entityId}`, {rating: newReview.rating, comment: newReview.content }, {withCredentials: true}
        );
        const { data } = response;
        if (data.success) {
          toast.success("Vendor review added successfully!");
        } else {
          toast.error("Failed to add vendor review.");
        }
      }

      setNewReview({
        name: "",
        rating: 0,
        content: "",
        images: [],
      });
      // setImagePreview([]);
      fetchReviews();
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   setNewReview({ ...newReview, images: files });
  //   setImagePreview(files.map((file) => URL.createObjectURL(file)));
  // };

  const renderStars = (rating, setRating) =>
    Array(5)
      .fill(0)
      .map((_, i) => (
        <span
          key={i}
          onClick={() => setRating(i + 1)}
          className="cursor-pointer"
        >
          {i < rating ? "★" : "☆"}
        </span>
      ));

  useEffect(() => {
    fetchReviews();
  }, [entityId, type, page]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Reviews for {type}</h2>

      <div>
        {reviews.map((review, index) => (
          <div key={index} className="mb-6 border-b pb-4">
            <h4 className="text-lg font-semibold">{review.name}</h4>
            <p>
              <strong>Service:</strong>{" "}
              {renderStars(review.rating, () => {})}
            </p>
            <p className="mt-2">{review.content}</p>
            {review.images?.length > 0 && (
              <div className="flex space-x-2 mt-4">
                {review.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Review"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-300 px-4 py-2 rounded-md"
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="bg-gray-300 px-4 py-2 rounded-md"
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">Add a Review</h3>
        <input
          type="text"
          placeholder="Your Name"
          value={newReview.name}
          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
          className="block w-full border p-2 rounded-md mb-4"
        />

        <div>
          <p className="mb-2">Rate Service:</p>
          <div className="text-yellow-500 text-lg">
            {renderStars(newReview.rating, (rating) =>
              setNewReview({ ...newReview, rating: rating })
            )}
          </div>
        </div>

        <textarea
          placeholder="Write your review"
          value={newReview.content}
          onChange={(e) =>
            setNewReview({ ...newReview, content: e.target.value })
          }
          className="block w-full border p-2 rounded-md mt-4"
        />

        {/* <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="block w-full border p-2 rounded-md mt-4"
        />
        <div className="flex space-x-2 mt-4">
          {imagePreview.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-md"
            />
          ))}
        </div> */}

        <button
          onClick={handleAddReview}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default ReviewSection;

0;
