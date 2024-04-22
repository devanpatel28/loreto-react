import React, { useState } from 'react';
import Logo from '../images/logo/Loreto.png';
import { Outlet, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { CHECK_LOGIN_API } from '../helper/api';
import Swal from 'sweetalert2';

const SignIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(CHECK_LOGIN_API, {
        username,
        password
      });
      const data = response.data;
      if (response.status === 200 && data.data.login.type === 'admin') {
        localStorage.setItem("userdata", JSON.stringify(data.data.userdata));
        Swal.fire({
          icon: "success",
          text: "Login Successful!",
          timer: 1000,
          width: "400px",
          showConfirmButton: false,
        });
        navigate('/dashboard');
      } else {
        Swal.fire({
          icon: "error",
          text: "Incorrect Username Or Password",
          timer: 1000,
          width: "400px",
          showConfirmButton: false,
        });
        console.error('Invalid credentials or non-admin user');
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Incorrect Username Or Password",
        timer: 1000,
        width: "400px",
        showConfirmButton: false,
      });
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
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-sm border-2 border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      {/* Password icon */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                      >
                        {showPassword ? (
                          <svg
                            className="h-5 w-5 mr-2 stroke-strokedark hover:stroke-graydark"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path  d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path  d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>

                        ) : (
                          <svg
                            className="h-5 w-5 mr-2 stroke-strokedark hover:stroke-graydark"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        )}
                      </button>
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
