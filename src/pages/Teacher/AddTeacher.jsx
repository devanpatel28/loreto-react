import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import axios from "axios";
import { ADD_LOGIN_API, GET_USER_ID, ADD_TEACHER_API, MAIL_API } from "../../helper/api";
import Loader from "../../common/Loader";
import Swal from "sweetalert2";

const AddTeacher = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNo: "",
    userType: "teacher", // Default value set to "teacher"
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { firstName, lastName, email, mobileNo , userType } = formData;

    // Generate username
    const username = `${firstName}${lastName}${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}`;
    const password = username;
    console.log(userType);
    try {
      const loginResponse = await axios.post(ADD_LOGIN_API, {
        username,
        password: password,
        email: email,
        type: userType,
        is_active: true,
      });

      if (loginResponse.status == 200) {
        const teacherIdResponse = await axios.post(GET_USER_ID, {
            username: username,
        });

        const teacherId = teacherIdResponse.data.data.id;
        // console.log(teacherId.value)
        // console.log(teacherIdResponse.data.data)
  
        const addTeacherResponse = await axios.post(ADD_TEACHER_API, {
          full_name: `${firstName} ${lastName}`,
          mobile_number: mobileNo,
          logindatum_id: teacherId,
        });

        const emailResponse = await axios.post(MAIL_API,{
          to: email,
          subject: "Welcome to LORETO",
          text: "",
          html:`
          <h2><p>Dear ${firstName} ${lastName},</p></h2>
          <h4><p>Welcome to LORETO! We're excited to have you on board as a teacher.</p></h4>
          <h4><p>Your login credentials:</p></h4>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>Password:</strong> ${password}</p>
          <p>We look forward to working with you and hope you have a rewarding experience teaching at LORETO.</p>
          <p>Best regards,<br>Your Team at LORETO</p>
        `,
        });
        console.log(emailResponse.data)
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Teacher added successfully!",
          width: "400px",
          timer: 1000,
          confirmButton: false,
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          mobileNo: "",
          userType: "teacher", // Reset userType to "teacher"
        });
        navigate('/teachers')
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "Error to adding teacher",
        width: "400px",
        timer: 1000,
        confirmButton: false,
      });
      console.error("Error adding teacher:", error);
    }finally {
      setLoading(false); // Hide loader after operation completes (success or failure)
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add Teacher" />
      <div className="flex-none mb-4 min-w-100">
        <form onSubmit={handleSubmit}>
        {loading && <Loader />}
          {!loading && <div className="p-6.5 w-180">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                First Name <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required              
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Last Name <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required              
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Email ID <span className="text-meta-1">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email ID"
                className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Mobile No. <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="mobileNo"
                value={formData.mobileNo}
                required
                onChange={handleChange}
                placeholder="Mobile Number"
                className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                User Type <span className="text-meta-1">*</span>
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              >
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="trainee">Trainee</option>
              </select>
            </div>
            <button type="submit" className="flex w-full justify-center rounded bg-graydark p-3 font-medium text-gray hover:bg-opacity-90">
              Add Teacher
            </button>
          </div>}
        </form>
      </div>
    </DefaultLayout>
  );
};

export default AddTeacher;
