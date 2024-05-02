import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { IoAdd } from "react-icons/io5";
import axios from "axios";
import { FcAlphabeticalSortingAz, FcAlphabeticalSortingZa } from "react-icons/fc";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { GET_LEVEL_API, FIND_COURSE_API, CHANGE_LEVEL_API } from "../../helper/api";
import Swal from "sweetalert2";

const LevelsPage = () => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [data, setData] = useState([]);
    const [editLevelId, setEditLevelId] = useState(null);
    const [editLevelName, setEditLevelName] = useState("");
    const [courseNames, setCourseNames] = useState({});
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(GET_LEVEL_API);
                setData(response.data.data);
                console.log(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Fetch course names for each level
        data.forEach((level) => {
            fetchCourseName(level.course_id);
        });
    }, [data]);

    const fetchCourseName = async (course_id) => {
        try {
            const response = await axios.post(FIND_COURSE_API, {
                id: course_id,
            });
            setCourseNames(prevState => ({
                ...prevState,
                [course_id]: response.data.data.course_name
            }));
        } catch (error) {
            console.error("Error fetching course name:", error);
        }
    };
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1);
    };


    const handleSaveChanges = async () => {
        try {
            // Make the HTTP request to update the level
            await axios.put(CHANGE_LEVEL_API, {
                id: editLevelId,
                level_name: editLevelName,
            });
            Swal.fire({
                icon: "success",
                text: "Changes saved successfully!",
                timer: 1000,
                width: "400px",
                showConfirmButton: false,
            });

            const response = await axios.get(GET_LEVEL_API);
            setData(response.data.data);
            setEditLevelId(null);
            setEditLevelName("");
        } catch (error) {
            console.error("Error updating level:", error);
            Swal.fire({
                icon: "error",
                text: "Level name already exists!",
                timer: 1000,
                width: "400px",
                showConfirmButton: false,
            });
            // Handle error
        } finally {
        }
    };

    const editLevel = (id) => {
        const level = data.find((level) => level.id === id);
        if (level) {
            setEditLevelId(id);
            setEditLevelName(level.level_name);
        }
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    // Function to handle sorting by column
    const handleSort = (column) => {
        if (sortBy === column) {
            // If the same column is clicked again, toggle the sort order
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // If a new column is clicked, set it as the sorting column and default to ascending order
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    // Function to sort data based on the selected column and sort order
    const sortedData = data.sort((a, b) => {
        if (sortBy === 'level_name') {
            if (sortOrder === 'asc') {
                return a.level_name.localeCompare(b.level_name);
            } else {
                return b.level_name.localeCompare(a.level_name);
            }
        } else if (sortBy === 'course_name') {
            if (sortOrder === 'asc') {
                return (courseNames[a.course_id] || '').localeCompare(courseNames[b.course_id] || '');
            } else {
                return (courseNames[b.course_id] || '').localeCompare(courseNames[a.course_id] || '');
            }
        } else {
            return 0;
        }
    });

    // Function to render sorting icons based on sort order
    const renderSortIcon = (column) => {
        if (sortBy === column) {
            return sortOrder === 'asc' ? <FcAlphabeticalSortingAz /> : <FcAlphabeticalSortingZa />;
        } else {
            // Return default sorting icon if no sorting is applied to this column
            return <FcAlphabeticalSortingAz />;
        }
    };
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Levels" />
            <div className="flex justify-normal items-center mb-4 w-50">
                <div>
                    <NavLink to="/add-levels">
                        <button onClick={() => setShowModal(true)}
                            class="min-w-50 inline-flex items-center justify-center gap-2.5 bg-graydark py-3 border-2 text-center font-medium text-white duration-200 ease-in-out hover:bg-opacity-0 hover:text-graydark hover:border-2"
                        >
                            <IoAdd size={30} />
                            Add Level
                        </button>
                    </NavLink>
                </div>
                <form className="flex items-center ml-10">
                    <input
                        type="text"
                        placeholder="Search Level"
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
                                        Level ID
                                    </span>
                                </th>
                                <th className="min-w-[20px] py-4 px-2 font-medium text-black dark:text-white ">
                                    <span className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('level_name')}>
                                        Level Name
                                        {renderSortIcon('level_name')}
                                    </span>
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    <span className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('course_name')}>
                                        Course Name
                                        {renderSortIcon('course_name')}
                                    </span>
                                </th>

                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.filter((level) => {
                                return search === '' ? level : level.level_name.toLowerCase().includes(search.toLowerCase());
                            }).map((level, key) => (
                                <tr key={key}>
                                    <td className="border-b border-[#eee] py-5 px-5  dark:border-strokedark ">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {level.id}
                                        </h5>

                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-5 dark:border-strokedark">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {level.level_name}
                                        </h5>

                                    </td>

                                    <td className="border-b border-[#eee] py-5 px-7 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {courseNames[level.course_id] || 'Loading...'}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <div className="flex items-center space-x-3.5">
                                            <button onClick={() => editLevel(level.id)} class="mx-0 px-3 py-1 focus:outline-none bg-graydark text-white hover:bg-opacity-50">
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
            {editLevelId && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-5">Edit Level</h2>
                        <div className="mb-4">
                            <label htmlFor="levelname" className="block mb-2 font-semibold">Level Name: </label>
                            <input
                                type="text"
                                id="levelname"
                                value={editLevelName}
                                onChange={(e) => setEditLevelName(e.target.value)}
                                className="border rounded-md px-3 py-2 w-full"
                                placeholder="Enter Level Name"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    setEditLevelId(null);
                                    setEditLevelName("");
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

export default LevelsPage;

