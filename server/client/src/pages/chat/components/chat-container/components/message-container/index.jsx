import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES, GET_CHANNELS_MESSAGES_ROUTE, HOST } from "@/utiles/contants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getcolor } from "@/lib/utils";
import { AvatarFallback } from "@/components/ui/avatar";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
    setSelectedChatMessages,
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log({ error });
      }
    };

    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(
          `${GET_CHANNELS_MESSAGES_ROUTE}/${selectedChatData._id}`,
          { withCredentials: true }
        );
        if (response.data.messages) {
          {console.log('Debugger',response)}
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log({ error });
      }
    }

    if (selectedChatData._id) {
      if (selectedChatType === "contact")  getMessages() 
      else if (selectedChatType === 'channel') getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filepath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filepath);
  };
  const renderMessage = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}

          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, totel } = progressEvent;
        const percentCompleted = Math.round((loaded * 100) / totel);
        setFileDownloadProgress(percentCompleted);
      },
    });

    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  };
  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded-md my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender === selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded-md my-1 max-w-[50%] break-words`}
        >
          {checkIfImage(message.fileURL) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageURL(message.fileURL);
              }}
            >
              <img
                src={`${HOST}/${message.fileURL}`}
                height={300}
                width={300}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-5">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileURL.split("/").pop()}</span>
              <span
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer tranisition-all duration-300"
                onClick={() => downloadFile(message.fileURL)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  const renderChannelMessages = (message) => {
    return (
      <div
        className={`mt-5 ${
          message.sender._id === userInfo._id ? "text-right" : "text-left"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id === userInfo._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded-md my-1 max-w-[50%] break-words ml-9`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
        <div
          className={`${
            message.sender._id === userInfo._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded-md my-1 max-w-[50%] break-words`}
        >
          {checkIfImage(message.fileURL) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageURL(message.fileURL);
              }}
            >
              <img
                src={`${HOST}/${message.fileURL}`}
                height={300}
                width={300}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-5">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileURL.split("/").pop()}</span>
              <span
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer tranisition-all duration-300"
                onClick={() => downloadFile(message.fileURL)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
        {message.sender._id !== userInfo._id ? (
          <div className="flex items-center justify-start gap-3 ">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden ">
              {message.sender.image && (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              )}
              <AvatarFallback
                className={`uppercase h-8 w-8  text-lg  flex items-center justify-center rounded-full ${getcolor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.split("").shift()
                  : message.sender.email.split("").shift()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
            <span className="text-sm text-white/60">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        ) : (
          <div className="text-sm text-white/60 mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="flex-1 overflow-y-auto scroll-smooth p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessage()}
      <div ref={scrollRef}></div>
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${imageURL}`}
              className="sm:h-[80vh]  sm:w-full sm:bg-cover "
              alt=""
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer tranisition-all duration-300"
              onClick={() => downloadFile(imageURL)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer tranisition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageURL(null);
              }}
            >
              <IoClose />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
