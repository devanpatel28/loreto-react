import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../../components/BreadCrumb/BreadCrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import { firestore } from "../../helper/firebase-config";
import { getDocs, addDoc, collection, serverTimestamp,deleteDoc,doc } from "firebase/firestore";
import { format } from "date-fns";
import Swal from "sweetalert2";

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const docRefs = await getDocs(collection(firestore, "messages"));
      const chatsArray = docRefs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const sortedChats = chatsArray.sort((b, a) => b.timestamp - a.timestamp);
      setChats(sortedChats);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };
  const deleteMessage = async (messageId) => {
    try {
      Swal.fire({
        text: "Are you sure to delete this message ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteDoc(doc(firestore, "messages", messageId)); // add the document reference here
          // Fetch chats again to update the UI
          fetchChats();
        }
      });
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  
  const sendMessage = async () => {
    if (message.trim() === "") {
      // If the message is empty, do nothing
      return;
    }
    try {
      await addDoc(collection(firestore, "messages"), {
        message: message,
        timestamp: serverTimestamp(),
      });
      setMessage("");
      fetchChats();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Chat" />
      <div className="flex flex-col h-115 border-2 rounded-md border-blue-200">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="flex-grow overflow-auto p-4">
            {chats.map((chat, index) => (
              <div key={index} className="mb-4 text-center relative">
                {index === 0 || (format(chat.timestamp.toDate(), "dd/MM/yyyy") !== format(chats[index - 1].timestamp.toDate(), "dd/MM/yyyy")) ? (
                  <div className="flex items-center">
                    <div className="h-0.5 bg-gray-400 w-full mr-2"></div>
                    <p className="text-sm text-gray-400">{format(chat.timestamp.toDate(), "dd/MM/yyyy")}</p>
                    <div className="h-0.5 bg-gray-400 w-full ml-2"></div>
                  </div>
                ) : null}
                <div className="flex flex-col items-end">
                  <div className="bg-blue-500 text-white py-2 px-4 rounded-2xl rounded-br-none max-w-md" onDoubleClick={() => deleteMessage(chat.id)}>
                    {chat.message}
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    {format(chat.timestamp.toDate(), "HH:mm a")}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
        <div className="flex items-center border-t bg-blue-100 border-blue-400 p-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full mr-5 rounded border-[1.5px]  border-blue-300 bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          <button
            onClick={sendMessage}
            className="bg-red-500 hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            Send
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ChatPage;
