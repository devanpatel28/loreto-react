import React, { useState } from 'react';
import Logo from '../images/logo/Loreto.png';
import { Outlet, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { CHECK_LOGIN_API } from '../helper/api';

const SignIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(CHECK_LOGIN_API, {
        username,
        password
      });
      const data = response.data;
      if (response.status === 200 && data.data && data.data.login.type === 'admin') {
        localStorage.setItem("userdata",JSON.stringify(data.data.userdata));
        navigate('/dashboard');
      } else {
        console.error('Invalid credentials or non-admin user');
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
    }
  };

  return (
    <>
      <div className="container mx-auto flex justify-center items-center h-screen">
        <div className="max-h-115 max-w-115 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-full sm:w-3/4 md:w-1/2 lg:w-2/5">
          <div className="flex flex-wrap items-center">
            <div className="w-full border-stroke dark:border-strokedark  xl:border-l-2">
              <div className=" flex align-middle items-center px-20 py-5">
                <img src={Logo} alt="Logo" />
              </div>
              <div className="w-full px-10 mt-5 mb-10">
                <form onSubmit={handleSignIn}>
                  <div className="mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-sm border-2 border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      {/* Username icon */}
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-sm border-2 border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      {/* Password icon */}
                    </div>
                  </div>
                  <div className="mb-5">
                    <input
                      type="submit"
                      value="Sign In"
                      className="w-full cursor-pointer rounded-sm  bg-black hover:bg-graydark p-4 text-white transition "
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default SignIn;
