import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import axios from "axios";
import { ADD_LOGIN_API, ADD_COURSEENROLL_API, ADD_STUDENT_API, GET_COURSE_API, GET_COURSE_LEVEL_API, GET_SHIFT_API, GET_USER_ID, MAIL_API } from "../../helper/api"; // Import your API endpoint
import Loader from "../../common/Loader";
import Swal from "sweetalert2"; // Import SweetAlert

const AddStudent = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile_number: "",
    course_id: "",
    last_month: "",
    course_level_id: "",
    shiftdatum_id: "",
    logindatum_id: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get(GET_COURSE_API);
        setCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    async function fetchShift() {
      try {
        const response = await axios.get(GET_SHIFT_API);
        setShifts(response.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }
    fetchShift();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { firstName,lastName, email, mobile_number, shiftdatum_id, course_level_id, course_id, last_month } = formData;

    // Generate username
    const username = `${firstName}${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}`;
    const password = username;
    try {
      const loginResponse = await axios.post(ADD_LOGIN_API, {
        username,
        password,
        email: email,
        type: "student",
        is_active: true,
      });

      if (loginResponse.status == 200) {
        const studentIdResponse = await axios.post(GET_USER_ID, {
          username: username,
        });

        const studentLoginID = studentIdResponse.data.data.id;

        const addStudentResponse = await axios.post(ADD_STUDENT_API, {
          full_name:`${firstName} ${lastName}`,
          email: email,
          mobile_number: mobile_number,
          shiftdatum_id: shiftdatum_id,
          logindatum_id: studentLoginID,
        });

        const studentID = addStudentResponse.data.data.id;
        const today = new Date();
        console.log(today + "----- today");
        console.log(last_month + "----- last_month");
        console.log(studentID + "----- studentID");
        console.log(course_id + "----- course_id");
        console.log(course_level_id + "----- course_level_id");

        const addCourseEnroll = await axios.post(ADD_COURSEENROLL_API, {
          enrollment_date: today,
          is_current_course: 1,
          last_month: last_month,
          course_status: 1,
          studentdatum_id: studentID,
          course_id: course_id,
          course_level_id: course_level_id || null,
        });

        const emailResponse = await axios.post(MAIL_API, {
          to: email,
          subject: "Welcome to LORETO",
          text: "",
          html: `
            <h2><p>Dear ${firstName} ${lastName},</p></h2>
            <h4><p>Welcome to LORETO! We're thrilled to have you join us.</p></h4>
            <h4><p>Your login credentials:</p></h4>
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Password:</strong> ${password}</p>
            <p>We hope you have a great learning experience with us.</p>
            <p>Best regards,<br>Your Team at LORETO</p>
          `,
        });
        console.log(emailResponse.data)
        Swal.fire({
          icon: "success",
          text: "Student added successfully!",
          width: "400px",
          timer: 1000,
          showConfirmButton: false,
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          mobile_number: "",
          course_id: "",
          last_month: "",
          course_level_id: "",
          shiftdatum_id: "",
          logindatum_id: "",
        });
        navigate('/manage-student')
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        width: "400px",
        timer: 1000,
        showConfirmButton: false,
      });
      console.error("Error adding student:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // const today = new Date();
  const handleCourseChange = async (e) => {
    const course_id = e.target.value;
    console.log("Selected course ID:", course_id);
    console.log(courses);
    const selectedCourse = courses.find(course => course.id == course_id);
    setFormData(prevState => ({
      ...prevState,
      course_id,
      last_month: calculateLastMonthDate(selectedCourse.time_duration)
    }));
    const calculateLastMonthDate = (courseDuration) => {
      const today = new Date();
      console.log(today+"----- today");
      const lastMonth = new Date(today.getFullYear(), today.getMonth() + courseDuration, today.getDate());
      console.log(lastMonth+"----- lastMonth");
      return lastMonth;
    };

    try {
      const response = await axios.post(GET_COURSE_LEVEL_API, { course_id: course_id });
      setLevels(response.data.data);
    } catch (error) {
      console.error("Error fetching course levels:", error);
      setLevels([]);
    }
  };

  const handleLevelChange = (e) => {
    setFormData({ ...formData, course_level_id: e.target.value });
  };
  const handleShiftChange = (e) => {
    setFormData({ ...formData, shiftdatum_id: e.target.value });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add Student" />
      <div className="flex-none mb-4 min-w-100">
        <form onSubmit={handleSubmit}>
          {loading && <Loader />}
          {!loading && (
            <div className="p-6.5 w-180">
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
                  Email <span className="text-meta-1">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Student Email"
                  className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Mobile Number <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Select Shift <span className="text-meta-1">*</span>
                </label>
                <select
                  name="shiftdatum_id"
                  value={formData.shiftdatum_id}
                  onChange={handleShiftChange}
                  className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                >
                  <option value="">Select Shift</option>
                  {shifts.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.shift_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Course Name <span className="text-meta-1">*</span>
                </label>
                <select
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleCourseChange}
                  className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.course_name}
                    </option>
                  ))}
                </select>
              </div>

              {levels.length > 0 && (
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Select Level <span className="text-meta-1">*</span>
                  </label>
                  <select
                    name="course_level_id"
                    value={formData.course_level_id}
                    onChange={handleLevelChange}
                    className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  >
                    <option value="">Select Level</option>
                    {levels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.level_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {levels.length === 0 && (
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Select Level <span className="text-meta-1">*</span>
                  </label>
                  <select
                    name="course_level_id"
                    value={formData.course_level_id}
                    onChange={handleLevelChange}
                    disabled
                    className="w-full rounded border-[1.5px] border-gray-300 bg-gray-200 py-3 px-5 text-gray-400 outline-none transition focus:border-primary active:border-primary"
                    required
                  >
                    <option value="">No Levels Available</option>
                  </select>
                </div>
              )}
              <button
                type="submit"
                className="flex w-full justify-center rounded bg-graydark p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Add Student
              </button>
            </div>
          )}
        </form>
      </div>
    </DefaultLayout>
  );
};

export default AddStudent;