import React, { useEffect, useState } from "react";
import axios from "axios"
import Cookies from 'js-cookie';
import { useUserAuth } from "../../context/UserAuthContext";
const HomePage = () => {
  const [authUserToken,setAuthUserToken]=useUserAuth()
  const [projectList,setProjectList]= useState([])

  const getUserInfo=async()=>{
    try {
      const response= await axios.get("http://localhost:3000/users/profile",{withCredentials:true})
      console.log(response.data.projects)
      setProjectList(response.data.projects)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getUserInfo()
  }, [])
  
  const handleLogout=()=>{
    try {
      localStorage.removeItem('user-token')
      setAuthUserToken(null)
      Cookies.remove('user') 
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }




  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          User Dashboard
        </h2>
        <button onClick={handleLogout} className="px-3 py-2 bg-red-500 text-white rounded-md">Logout</button>

        {/* Progress Bar */}
        <div className="mb-4">
          <h3 className="text-lg font-medium">Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
            
            ></div>
          </div>
          <p className="text-center text-sm text-gray-600">
            
          </p>
        </div>

        
        <div className="space-y-4">
          
            {projectList.map((project,index)=>{
              return (
                <div
            key={index}
              className="flex justify-between items-center p-4 border border-gray-300 rounded-md shadow-sm"
            >
              <div>
                <h4 className="text-lg font-medium">{project.name}</h4>
                <p className="text-sm text-gray-500">{project.description}</p>
              </div>
              <div className="flex items-center space-x-2">
            
                  <>
                    <button
                      
                      className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      
                      className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600"
                    >
                      Decline
                    </button>
                  </>
             
              
                            
              </div>
            </div>
              )
            })}
     
        </div>

      </div>
    </div>
  );
};

export default HomePage;
