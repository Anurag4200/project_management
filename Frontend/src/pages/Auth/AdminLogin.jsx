import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
const AdminLogin = () => {
  const [authAdminToken, setAuthAdminToken] = useAdminAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(""); // To show error message
  const [successMessage, setSuccessMessage] = useState(""); // Success message
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    setLoading(true); // Set loading state to true when starting the request
    setError(""); // Clear any previous error messages
    setSuccessMessage(""); // Clear previous success message
    console.log(data);
    try {
      const response = await axios.post(
        "http://localhost:3000/admin/login",
        data
      );
      if (response.status === 200) {
        console.log(response.data);
        setSuccessMessage("Login successful!");
        setAuthAdminToken(response.data.token);
        localStorage.setItem(
          "admin-token",
          JSON.stringify(response.data.token)
        );
        navigate("/admin-dashboard");

        reset(); // Reset the form after successful submission
      } else {
        setError("Failed to register. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later."); // Show error message for failed request
      console.error("Error during registration:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
    reset();
  };

  return (
    <>
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-center text-gray-700">
            Admin Login
          </h2>
          {loading && <p>Loading...</p>}
          {/* Display success or error message */}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                {...register("email", { required: true })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <span>This field is required</span>}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                {...register("password", { required: true })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && <span>This field is required</span>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
