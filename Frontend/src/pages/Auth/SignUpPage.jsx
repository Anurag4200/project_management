import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
const SignUpPage = () => {
  const [authUserToken,setAuthUserToken]= useUserAuth()
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(""); // To show error message
  const [successMessage, setSuccessMessage] = useState(""); // Success message
  const navigate= useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = async (data) => {
    setLoading(true); // Set loading state to true when starting the request
    setError(""); // Clear any previous error messages
    setSuccessMessage(""); // Clear previous success message

    const formData = {
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname,
      },
      email: data.email,
      password: data.password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/users/register",
        formData
      );

      if (response.status === 201) {
        console.log(response.data);
        setSuccessMessage("Registration successful!"); // Show success message
        setAuthUserToken(response.data.token)
        localStorage.setItem("user-token",JSON.stringify(response.data.token))
        navigate("/user-dashboard")
        reset(); // Reset the form after successful submission
      } else {
        setError("Failed to register. Please try again."); // Show error message if status isn't 201
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
      <div className="w-screen min-h-screen flex justify-center items-center">
        <div className="w-96 h-96 rounded-lg p-5 border-2 border-gray-300">
          <h1 className="text-2xl font-medium mb-4">User SignUp</h1>
          {/* Display loading spinner */}
          {loading && <p>Loading...</p>}
          {/* Display success or error message */}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              className="px-3 mb-2 py-2 w-full bg-gray-500 text-white rounded-md"
              type="text"
              name="firstname"
              {...register("firstname", { required: true })}
              placeholder="Firstname"
            />
            {errors.firstname && (
              <span className="text-xs text-red-500 ">
                This field is required
              </span>
            )}
            <input
              className="px-3 mb-2 py-2 w-full bg-gray-500 text-white rounded-md"
              type="text"
              name="lastname"
              {...register("lastname", { required: true })}
              placeholder="Lastname"
            />
            {errors.lastname && (
              <span className="text-xs text-red-500 ">
                This field is required
              </span>
            )}
            <input
              className="px-3 mb-2 py-2 w-full bg-gray-500 text-white rounded-md"
              type="email"
              name="email"
              {...register("email", { required: true })}
              placeholder="Email"
            />
            {errors.email && (
              <span className="text-xs text-red-500 ">
                This field is required
              </span>
            )}
            <input
              className="px-3 mb-2 py-2 w-full bg-gray-500 text-white rounded-md"
              type="password"
              name="password"
              {...register("password", { required: true, minLength: [7] })}
              placeholder="Password"
            />
            {errors.password && (
              <span className="text-xs text-red-500 ">
                This field is required minnimum length 7
              </span>
            )}
            <button className="px-3 py-2 bg-green-500 block text-white rounded-md">
              Register
            </button>
          </form>
          <p>
            Already have account?
            <Link to="/">
              <span className="text-blue-500 underline cursor-pointer">
                Login
              </span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
