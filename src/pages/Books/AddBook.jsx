import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import axios from "axios";
import { ADD_COURSE_API } from "../../helper/api"; // Import your API endpoint
import Loader from "../../common/Loader";
import Swal from "sweetalert2"; // Import SweetAlert
import { storage } from "../../helper/firebase-config.js";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


const AddBook = () => {
  const [formData, setFormData] = useState({
    book_name: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewPDF, setPreviewPDF] = useState(null);
  const [FilePDF, setFilePDF] = useState(null);


  const handleChange = (e) => {
     if(e.target.name === "book") {
      setFilePDF(e.target.files[0]); // Update FilePDF state
      setPreviewPDF(URL.createObjectURL(e.target.files[0])); // Update previewPDF state
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!FilePDF) {
      errSwal();
      return;
    }
  
    setLoading(true); // Show loading indicator
  
    const pdfRef = ref(storage, `books/${formData.book_name}.pdf`);
    try {
      await uploadBytes(pdfRef, FilePDF); 

      // Get the image URL after successful upload
      const pdfUrl = await getDownloadURL(pdfRef);

      console.log("PDF URL", pdfUrl);

          Swal.fire({
            icon: "success",
            text: "Book uploaded successfully!",
            timer: 1000,
            width: "400px",
            showConfirmButton: false,
          });
         
      setLoading(false);
      setFormData({
        book_name:""
      });
      setFilePDF(null)
      setPreviewPDF(null);
      navigate('/books');

    } catch (error) {
      console.error("Error uploading Data", error);
      setLoading(false); 
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Upload Book" />
      <div className="flex-none mb-4 min-w-100">
        <form onSubmit={handleSubmit}>
          {loading && <Loader />}
          {!loading && (
            <div className="p-6.5 w-180">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Book Name <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="book_name"
                  value={formData.book_name}
                  onChange={handleChange}
                  placeholder="Book Name"
                  className="w-full rounded border-[1.5px]  border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                />
              </div>

              <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Project Brochure (PDF) <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    name="book"
                    onChange={handleChange}
                    className="w-full rounded border-[1.5px] border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  />
                  {previewPDF && (
                    <object
                      data={previewPDF}
                      type="application/pdf"
                      width="100%"
                      height="400"
                      className="mt-2 rounded-md border-2 border-blue-700"
                    >
                      <p>This browser does not support PDFs. Please download the PDF to view it: <a href={previewPDF}>Download PDF</a></p>
                    </object>
                  )}
              </div>


              <button
                type="submit"
                className="flex w-full justify-center rounded bg-graydark p-3 font-medium text-gray hover:bg-opacity-90"
              >
               Upload Book 
              </button>
            </div>
          )}
        </form>
      </div>
    </DefaultLayout>
  );
};

export default AddBook;