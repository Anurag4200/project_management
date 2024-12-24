import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
const Start = () => {
  const [authUserToken, setAuthUserToken] = useUserAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = async (data) => {
    setLoading(true);
    setError(""); 
    setSuccessMessage(""); 
    console.log(data);
    try {
      const response = await axios.post(
        "http://localhost:3000/users/login",
        data
      );
      if (response.status === 200) {
        console.log(response.data);
        setSuccessMessage("Login successful!");
        setAuthUserToken(response.data.token);
        localStorage.setItem("user-token", JSON.stringify(response.data.token));
        navigate("/user-dashboard");
        reset(); 
      } else {
        setError("Failed to register. Please try again."); 
      }
    } catch (error) {
      setError("An error occurred. Please try again later."); 
      console.error("Error during registration:", error);
    } finally {
      setLoading(false); 
    }
    reset();
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-900 text-white">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Project Management</h1>
          <p className="text-xl mb-8">
            Manage your projects, tasks, and teams effectively with our
            intuitive platform.
          </p>
          <button
            className="px-5 py-3 bg-green-500 rounded-lg"
            onClick={() => setIsModalOpen(true)} // Open the modal on button click
          >
            Login
          </button>

          {/* Modal */}
          {isModalOpen && (
            <dialog open className="modal">
              <div className="modal-box bg-black w-full flex flex-col justify-center items-start ">
                <form
                  className="flex flex-col gap-2 justify-center items-start w-full"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <button
                    type="button"
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => setIsModalOpen(false)} // Close the modal
                  >
                    ✕
                  </button>
                  <h1 className="text-2xl font-medium">User Login</h1>
                  {loading && <p>Loading...</p>}
                  {/* Display success or error message */}
                  {successMessage && (
                    <p className="text-green-500">{successMessage}</p>
                  )}
                  {error && <p className="text-red-500">{error}</p>}
                  <input
                    className="w-96 px-3 py-2 rounded-md border-0 bg-gray-800 text-white"
                    type="email"
                    placeholder="email"
                    name="email"
                    {...register("email", { required: true })}
                  />
                  {errors.email && (
                    <span className="text-xs text-red-500 ">
                      This field is required
                    </span>
                  )}
                  <input
                    className="w-96  px-3 py-2 rounded-md border-0 bg-gray-800 text-white"
                    type="password"
                    placeholder="password"
                    name="password"
                    {...register("password", {
                      required: true,
                      minLength: [7],
                    })}
                  />
                  {errors.password && (
                    <span className="text-xs text-red-500 ">
                      This field is required minimum length 7
                    </span>
                  )}
                  <button
                    className="px-3 py-2 w-1/4 rounded-md bg-green-500 text-white font-medium"
                    type="submit" 
                  >
                    Login
                  </button>
                </form>
                <p>
                  Don't have an account?{" "}
                  <Link to="/register">
                    <span className="text-blue-500 underline cursor-pointer">
                      Register
                    </span>
                  </Link>
                </p>
                <p>
                  Admin?{" "}
                  <Link to="/admin-login">
                    <span className="text-blue-500 underline cursor-pointer">
                      admin login
                    </span>
                  </Link>
                </p>
              </div>
            </dialog>
          )}
        </div>
        <footer className="absolute bottom-4 text-sm">
          <p>© 2024 Project Manager. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Start;
