import React, { useState, useEffect } from "react";
import { Link, NavLink, Route } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { IoAdd } from "react-icons/io5";
import axios from "axios";
import { FcAlphabeticalSortingAz, FcAlphabeticalSortingZa, FcNumericalSorting12, FcNumericalSorting21 } from "react-icons/fc";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { CHANGE_TYPE_API, CHANGE_USER_STATUS_API, FIND_SHIFT_API, GET_STUDENT_API, GET_STUDENT_LIST_API } from "../../helper/api";
import { underDev } from "../../helper/alert";
import Swal from "sweetalert2";


const StudentPage = () => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [data, setData] = useState([]);
    const [shift_name, setShiftName] = useState([]);
    const [editStudentId, seteditStudentId] = useState(null);
    const [editUserType, setEditUserType] = useState("");
    const [editUserStatus, setEditUserStatus] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(GET_STUDENT_LIST_API);
                setData(response.data.data);
                console.log("Student Data:", response.data.data)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        // Fetch course names for each level
        data.forEach((student) => {
            fetchShiftName(student.userdata.shiftdatum_id);
        });
    }, [data]);

    const fetchShiftName = async (shiftdatum_id) => {
        console.log("In function Shift ID:", shiftdatum_id);
        try {
            console.log("Shift ID:", shiftdatum_id);
            const response = await axios.post(FIND_SHIFT_API, {
                id: shiftdatum_id,
            });
            console.log("Shift Name:", response.data.data.shift_name);
            setShiftName(prevState => ({
                ...prevState, [shiftdatum_id]: response.data.data.shift_name
            }));
        } catch (error) {
            console.error("Error fetching Shift name:", error);
        }
    };
   
    const editTeacher = (id) => {
        const teacher = data.find((teacher) => teacher.login.id === id);
        if (teacher) {
            seteditStudentId(id);
            setEditUserType(teacher.login.type);
            setEditUserStatus(teacher.login.is_active);
        }
    };

    const saveChanges = async () => {
        try {
        const teacher = data.find((teacher) => teacher.login.id === editStudentId);
          await axios.put(CHANGE_TYPE_API, {
            id: editStudentId,
            type: editUserType,
          });
          console.log("editUserStatus",editUserStatus);
          console.log("teacher.login.is_active",teacher.login.is_active);

          if (editUserStatus!=teacher.login.is_active) {
            await axios.put(CHANGE_USER_STATUS_API, {
              id: editStudentId,
            });
          }

          Swal.fire({
            icon: "success",
            text: "Changes saved successfully!",
            timer: 1000,
            width: "400px",
            showConfirmButton: false,
          });

          // Refresh the teacher list after successful update
          const response = await axios.get(GET_STUDENT_LIST_API);
          setData(response.data.data);
          seteditStudentId(null);
          setEditUserType("");
          setEditUserStatus("");

        } catch (error) {
          console.error("Error updating teacher:", error);
        }
      };
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1);
    };

    const filteredData = data.filter((student) => {
        return search === '' ? student : student.full_name.toLowerCase().includes(search.toLowerCase());
    });

    const handleViewClick = (studentID) => {
        console.log("Selected Student ID:", studentID)
        localStorage.setItem("selectedStudent", studentID);

    };
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Students" />
            <div className="flex justify-normal items-center mb-4 w-50">
                <div>
                    <NavLink to="/add-student">
                        <button
                            class="min-w-50 inline-flex items-center justify-center gap-2.5 bg-graydark py-3 border-2 text-center font-medium text-white duration-200 ease-in-out hover:bg-opacity-0 hover:text-graydark hover:border-2"
                        >
                            <IoAdd size={30} />
                            Add Student
                        </button>
                    </NavLink>
                </div>
                <form className="flex items-center ml-10">
                    <input
                        type="text"
                        placeholder="Search Student"
                        className="border w-100 rounded-sm focus:outline-none border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
                <div className="flex ml-20">
                    <label className="min-w-25 mr-2 mt-2.5">Show entries:</label>
                    <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="border rounded-sm border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white px-3 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-red-50 text-left dark:bg-meta-4">
                                <th className="min-w-10 py-4 px-2 font-medium text-black dark:text-white ">
                                    <span className="flex items-center gap-1">
                                        No.
                                    </span>
                                </th>
                                <th className="min-w-[20px] py-4 px-2 font-medium text-black dark:text-white ">
                                    <span className="flex items-center gap-1">
                                        Name
                                    </span>
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Shift
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Mobile Number
                                </th>
                                <th className="min-w-10 py-4 px-4 font-medium text-black dark:text-white ">
                                    <span className="flex items-center gap-1">
                                        Status
                                    </span>
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.slice(indexOfFirstItem, indexOfLastItem).map((student, key) => (
                                <tr key={key}>
                                    <td className="border-b border-[#eee] py-5 px-5  dark:border-strokedark ">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {key + 1}
                                        </h5>

                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-3 dark:border-strokedark">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {student.userdata.full_name}
                                        </h5>

                                    </td>

                                    <td className="border-b border-[#eee] py-5 px-5 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {console.log("DATA "+student.userdata.shift_name)}
                                            {shift_name[student.userdata.shiftdatum_id]}
                                        </p>
                                    </td>

                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {student.userdata.mobile_number}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p
                                            className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${student.login.is_active == 1
                                                ? 'bg-success text-success'
                                                : 'bg-danger text-danger'
                                                }`}
                                        >
                                            {student.login.is_active == 1 ? 'Active' : 'Inactive'}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <div className="flex items-center space-x-3.5">
                                            <button onClick={() => editTeacher(student.login.id)} className="mx-0 px-3 py-1 focus:outline-none bg-graydark text-white hover:bg-opacity-50">
                                                Edit
                                            </button>
                                            <Link
                                                to={{
                                                    pathname: "/view-student",
                                                    state: { student: student }
                                                }}
                                                onClick={() => handleViewClick(student.userdata.id)} // Update this line
                                                className="mx-0 px-3 py-1 focus:outline-none bg-graydark text-white hover:bg-opacity-50"
                                            >
                                                VIEW
                                            </Link>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4 mb-4">
                    {/* Previous Button */}
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        className={`mx-1 px-3 py-1 focus:outline-none 
                        ${currentPage === 1 ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-graydark text-white hover:bg-opacity-90'}`}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    {/* Pagination Buttons */}
                    {[...Array(Math.ceil(data.length / itemsPerPage)).keys()].map((number) => (
                        <button
                            key={number}
                            onClick={() => paginate(number + 1)}
                            className={`mx-1 px-3 py-1 squ-full focus:outline-none 
                            ${currentPage === number + 1 ? 'rounded-md bg-graydark text-white' : 'bg-gray-300 text-gray-700 hover:bg-opacity-90'}`}
                        >
                            {number + 1}
                        </button>
                    ))}

                    {/* Next Button */}
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        className={`mx-1 px-3 py-1 focus:outline-none 
                        ${currentPage === Math.ceil(data.length / itemsPerPage) ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-graydark text-white hover:bg-opacity-90'}`}
                        disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
                    >
                        Next
                    </button>
                </div>
                {editStudentId !== null && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
                        <div className="bg-white p-5 rounded-md shadow-lg w-80 h-30">
                            <div className="mb-4">
                                <label htmlFor="userStatus">Student Status : </label>
                                <select
                                    id="userStatus"
                                    value={editUserStatus}
                                    onChange={(e) => setEditUserStatus(e.target.value)}
                                    className="border rounded-md px-2 py-1"
                                >
                                    <option value={true}>Active</option>
                                    <option value={false}>Inactive</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => {
                                        seteditStudentId(null);
                                        setEditUserType("");
                                        setEditUserStatus("");
                                    }}
                                    className="mx-0 px-3 py-1 focus:outline-none bg-graydark text-white hover:bg-opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveChanges}
                                    className="mx-0 ml-5 px-3 py-1 focus:outline-none bg-blue-600 text-white hover:bg-opacity-50"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </DefaultLayout>
    );
};

export default StudentPage;