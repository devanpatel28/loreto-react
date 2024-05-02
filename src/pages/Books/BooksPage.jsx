import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { IoAdd } from "react-icons/io5";
import axios from "axios";
import { storage } from "../../helper/firebase-config.js";
import { getDownloadURL, ref, listAll, getMetadata, deleteObject } from "firebase/storage";
import Swal from "sweetalert2";
import { RiDeleteBinLine } from "react-icons/ri";
import { AiOutlineDownload } from "react-icons/ai";

const BooksPage = () => {
    const [search, setSearch] = useState('');
    const [bookData, setBookData] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const storageRef = ref(storage, 'books');
                const bookList = await listAll(storageRef);

                const bookPromises = bookList.items.map(async (item) => {
                    const downloadURL = await getDownloadURL(item);
                    const metadata = await getMetadata(item);
                    return { name: item.name, url: downloadURL, size: metadata.size };
                });

                const books = await Promise.all(bookPromises);
                setBookData(books);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        fetchBooks();
    }, []);

    const filteredBooks = bookData.filter((book) => {
        return search === '' ? true : book.name.toLowerCase().includes(search.toLowerCase());
    });

    const handleDeleteBook = async (bookName) => {
        const storageRef = ref(storage, `books/${bookName}`);
        try {
            await deleteObject(storageRef);
            setBookData(bookData.filter((book) => book.name !== bookName));
            Swal.fire({
                icon: "success",
                text: "Book deleted successfully!",
                width: "400px",
                timer: 1000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Error deleting book:", error);
            Swal.fire('Error!', 'Failed to delete the book.', 'error');
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Books" />
            <div className="flex justify-normal items-center mb-4 w-50">
                <div>
                    <NavLink to="/add-book">
                        <button
                            className="min-w-50 inline-flex items-center justify-center gap-2.5 bg-graydark py-3 border-2 text-center font-medium text-white duration-200 ease-in-out hover:bg-opacity-0 hover:text-graydark hover:border-2"
                        >
                            <IoAdd size={30} />
                            Upload Book
                        </button>
                    </NavLink>
                </div>
                <form className="flex items-center ml-10">
                    <input
                        type="text"
                        placeholder="Search Book"
                        className="border w-100 rounded-sm focus:outline-none border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
            </div>

            <div className="rounded-sm border border-stroke bg-white px-3 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-red-50 text-left dark:bg-meta-4">
                                <th className="min-w-10 py-4 px-4 font-medium text-black dark:text-white ">
                                    <span className="flex items-center gap-1">
                                        ID
                                    </span>
                                </th>
                                <th className="min-w-[20px] py-4 px-8 font-medium text-black dark:text-white ">
                                    <span className="flex items-center gap-1">
                                        Book Name
                                    </span>
                                </th>
                                <th className="py-4 px-6 font-medium text-black dark:text-white">
                                    Upload Date
                                </th>
                                <th className="py-4 px-6 font-medium text-black dark:text-white">
                                    File Size
                                </th>
                                <th className="py-4 px-20 font-medium text-black dark:text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.map((book, index) => (
                                <tr key={index}>
                                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark ">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {index + 1}
                                        </h5>
                                    </td>
                                    <td className="border-b border-[#eee] py-4 px-8 dark:border-strokedark">
                                        <h5 className="font-medium mr-4 text-black dark:text-white">
                                            {book.name}
                                        </h5>
                                    </td>
                                    <td className="border-b border-[#eee] py-4 px-6 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {new Date().toDateString()}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-4 px-6 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {formatBytes(book.size)}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-4 px-6 dark:border-strokedark">
                                        <div className="flex items-center space-x-4">
                                            <a href={book.url} download={book.name} target="_blank" rel="noopener noreferrer" className="mx-0 px-3 py-1 focus:outline-none bg-graydark text-white hover:bg-opacity-50">
                                               
                                                <span>Download</span>
                                            </a>
                                            <button onClick={() => {
                                                Swal.fire({
                                                    text: 'Are you sure want to delete this book?',
                                                    icon: 'warning',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Yes, delete it!',
                                                    cancelButtonText: 'No, keep it',
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        handleDeleteBook(book.name);
                                                    }
                                                });
                                            }} className="mx-0 px-3 py-1 focus:outline-none bg-graydark text-white hover:bg-opacity-50">
                                               
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default BooksPage;

// Function to format bytes into a human-readable format
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
