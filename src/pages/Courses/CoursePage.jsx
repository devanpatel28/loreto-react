import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { IoAdd } from "react-icons/io5";
import axios from "axios";
import { FcAlphabeticalSortingAz, FcAlphabeticalSortingZa, FcNumericalSorting12, FcNumericalSorting21 } from "react-icons/fc";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { CHANGE_COURSE_API, GET_COURSE_API } from "../../helper/api";
import Swal from "sweetalert2";

const CoursePage = () => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [data, setData] = useState([]);
    const [editCourseId, setEditCourceId] = useState(null);
    const [editCourseName, setEditCourseName] = useState("");
    const [editTimeDuration, setEditTimeDuration] = useState("");
    const [editHasLevels, setEditHasLevels] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(GET_COURSE_API);
                setData(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1);
    };

    const editCourse = (id) => {
        const cource = data.find((cource) => cource.id === id);
        if (cource) {
            setEditCourceId(id);
            setEditCourseName(cource.course_name);
            setEditTimeDuration(cource.time_duration);
            setEditHasLevels(cource.has_levels);
        }
    };
    const filteredData = data.filter((cource) => {
        return search === '' ? cource : cource.course_name.toLowerCase().includes(search.toLowerCase());
    });
    const handleSaveChanges = async () => {
        try {
            // Make the HTTP request to update the course
            await axios.put(CHANGE_COURSE_API, {
                id: editCourseId,
                course_name: editCourseName,
                time_duration: editTimeDuration,
                has_levels: editHasLevels,
            });

            Swal.fire({
                icon: "success",
                text: "Changes saved successfully!",
                timer: 1000,
                width: "400px",
                showConfirmButton: false,
            });

            const response = await axios.get(GET_COURSE_API);
            setData(response.data.data);
            setEditCourceId(null);
            setEditCourseName("");
            setEditTimeDuration("");
            setEditHasLevels("");
            
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Course already exists!",
                timer: 1000,
                width: "400px",
                showConfirmButton: false,
              });
            console.error("Error updating course:", error);
            // Handle error
        }
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Courses" />
            <div className="flex justify-normal items-center mb-4 w-50">
                <div>
                    <NavLink to="/add-course">
                        <button
                            class="min-w-50 inline-flex items-center justify-center gap-2.5 bg-graydark py-3 border-2 text-center font-medium text-white duration-200 ease-in-out hover:bg-opacity-0 hover:text-graydark hover:border-2"
                        >
                            <IoAdd size={30} />
                            Add Course
                        </button>
                    </NavLink>
                </div>
                <form className="flex items-center ml-10">
                    <input
                        type="text"
                        placeholder="Search Cource"
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
                                        Course ID
                                    </span>
                                </th>
                                <th className="min-w-[20px] py-4 px-2 font-medium text-black dark:text-white ">
                                    <span className="flex items-center gap-1">
                                        Cource Name
                                    </span>
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Time Duration
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Has Levels
                                </th>

                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.slice(indexOfFirstItem, indexOfLastItem).map((cource, key) => (
                                <tr key={key}>
                                    <td className="border-b border-[#eee] py-5 px-5  dark:border-strokedark ">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {cource.id}
                                        </h5>

                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-5 dark:border-strokedark">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {cource.course_name}
                                        </h5>

                                    </td>

                                    <td className="border-b border-[#eee] py-5 px-7 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {cource.time_duration} Months
                                        </p>
                                    </td>

                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {cource.has_levels == 1 ? 'YES' : 'NO'}
                                        </p>
                                    </td>

                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <div className="flex items-center space-x-3.5">
                                            <button onClick={() => editCourse(cource.id)} class="mx-0 px-3 py-1 focus:outline-none bg-graydark text-white hover:bg-opacity-50">
                                                Edit
                                            </button>
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

            </div>
            {editCourseId && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-5">Edit Course</h2>
                        <div className="mb-4">
                            <label htmlFor="editCourseName" className="block mb-2 font-semibold">Course Name: </label>
                            <input
                                type="tet"
                                id="editCourseName"
                                value={editCourseName}
                                onChange={(e) => setEditCourseName(e.target.value)}
                                className="border rounded-md px-3 py-2 w-full"
                                placeholder="Enter Course Name"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="hasLevels" className="block mb-2 font-semibold">Has Levels :</label>
                            <select
                                id="hasLevels"
                                value={editHasLevels} // Make sure to use editHasLevels here
                                onChange={(e) => setEditHasLevels(e.target.value)}
                                className="border rounded-md px-3 py-2 w-full"
                            >
                                <option value={true}>YES</option>
                                <option value={false}>NO</option>
                            </select>
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="time_duration" className="block mb-2 font-semibold">Time Duration (MONTHS): </label>
                            <input
                                type="number"
                                id="time_duration"
                                value={editTimeDuration}
                                onChange={(e) => setEditTimeDuration(e.target.value)}
                                className="border rounded-md px-3 py-2 w-full"
                                placeholder="Enter time duration"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    setEditCourceId(null);
                                    setEditCourseName("");
                                    setEditTimeDuration("");
                                    setEditHasLevels(""); // Reset editHasLevels when cancelling
                                }}
                                className="mx-0 px-3 py-1 focus:outline-none bg-graydark text-white hover:bg-opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                className="mx-0 ml-5 px-3 py-1 focus:outline-none bg-blue-600 text-white hover:bg-opacity-50"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </DefaultLayout>
    );
};

export default CoursePage;

