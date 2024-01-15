import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../App";
import { useSelector } from "react-redux";
import Folder from "../components/Folder";
import File from "../components/File";
import EmptyState from "../components/EmptyState";
import { FaFileUpload } from "react-icons/fa";
import toast from "react-hot-toast";

const Home = () => {
  const [verifiedUser, setVerifiedUser] = useState(false);
  const [loading, setLoading] = useState(false)
  const [folderName, setFolderName] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFileName, setUploadFileName] = useState(null);
  const [uploadFileType, setUploadFileType] = useState("");
  const [uploadFieSize, setUploadFileSize] = useState(null);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState("root");
  const [folderHistory, setFolderHistory] = useState([]);
  const [currentFolderName, setCurrentFolderName] = useState("root");
  const [folderNameHistory, setFolderNameHistory] = useState(["root"]);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${SERVER_URL}/api/auth/verifyuser`, {
          credentials: "include",
        });
        const data = res.json();
        if (!res.ok) {
          toast.error("you are not a verified user!");
          setLoading(false)
          return;
        }
        setVerifiedUser(true);
        setLoading(false)
      } catch (error) {
        toast.error(error.message || "Something went wrong!");
        setLoading(false)
      }
    };
    verifyUser()
  }, []);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchFolders = async (folderId) => {
      try {
        const res = await fetch(`${SERVER_URL}/api/folder/${folderId}`, {
          credentials: "include",
        });
        const data = await res.json();
        setFiles(data.files);
        setFolders(data.folders);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFolders(currentFolderId);
    setUploadFile(null);
    setUploadFileName("");
    setFolderName("");
  }, [refetch, currentFolderId]);

  const handleFolderCreation = async (e) => {
    const formData = {
      userId: currentUser._id,
      folderName,
      parentFolderId: currentFolderId,
    };
    try {
      const res = await fetch(`${SERVER_URL}/api/folder/createfolder`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Semthing went wrong!");
        return;
      }
      toast.success("Folder created!");
      setRefetch((prev) => !prev);
    } catch (error) {
      setUploadFileName("");
      toast.error(error.message || "Semthing went wrong!");
    }
  };

  const handleRemaneFolder = async (folderId, name) => {
    const res = await fetch(
      `${SERVER_URL}/api/folder/renamefolder/${folderId}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newName: name,
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Semthing went wrong!");
      return;
    }
    toast.success("Folder renamed!");
    setRefetch((prev) => !prev);
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      const res = await fetch(
        `${SERVER_URL}/api/folder/deletefolder/${folderId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Semthing went wrong!");
        return;
      }
      toast.success("Folder deleted!");
      setRefetch((prev) => !prev);
    } catch (error) {
      toast.error(error.message || "Semthing went wrong!");
    }
  };

  const handleOpenFolder = (folderId, folderName) => {
    if (currentFolderId === "root") {
      setFolderHistory([]);
      setFolderNameHistory([]);
    }
    setFolderHistory((prev) => [...prev, currentFolderId]);
    setFolderNameHistory((prev) => [...prev, folderName]);
    setCurrentFolderId(folderId);
    setCurrentFolderName(folderName);
  };

  const handleGoBack = () => {
    setFolderHistory((prev) => {
      const newHistory = [...prev];
      const parentFolderId = newHistory[newHistory.length - 1] || "root";
      setCurrentFolderId(parentFolderId);
      newHistory.pop(); // remove the last element
      return newHistory;
    });
    setFolderNameHistory((prev) => {
      const newHistory = [...prev];
      newHistory.pop(); // remove the last element
      const parentFolderName = newHistory[newHistory.length - 1] || "root";
      setCurrentFolderName(parentFolderName);
      return newHistory;
    });
  };

  console.log(folderNameHistory);

  const uploadFileToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "wqmdesjn");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dssgc8nw6/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Upload failed:", errorData);
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.secure_url; // URL of the uploaded file
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const handleFileCreation = async () => {
    if (uploadFile) {
      const fileUrl = await uploadFileToCloudinary(uploadFile);
      if (fileUrl) {
        try {
          const formData = {
            userId: currentUser._id,
            fileName: uploadFileName,
            fileType: uploadFileType === "pdf" ? "pdf" : "image",
            fileSize: uploadFieSize,
            folderId: currentFolderId,
            fileUrl: fileUrl,
            previewUrl: fileUrl,
          };
          const res = await fetch(`${SERVER_URL}/api/file/uploadfile`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          if (!res.ok) {
            toast.error(data.message || "Semthing went wrong!");
            return;
          }
          toast.success("File uploaded!");
          setRefetch((prev) => !prev);
          setUploadFile(null);
          setUploadFileName("");
        } catch (error) {
          toast.error(error.message || "Semthing went wrong!");
        }
      }
    }
  };

  const handleFileRename = async (fileId, name, folderId) => {
    const res = await fetch(
      `${SERVER_URL}/api/file/rename-movefile/${fileId}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newName: name,
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Semthing went wrong!");
      return;
    }
    toast.success("File renamed!");
    setRefetch((prev) => !prev);
  };

  const handleFileMove = async (fileId, movingToFolderId) => {
    try {
      const res = await fetch(
        `${SERVER_URL}/api/file/rename-movefile/${fileId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newFolderId: movingToFolderId,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Semthing went wrong!");
        return;
      }
      toast.success("File moved");
      setRefetch((prev) => !prev);
    } catch (error) {
      toast.error(error.message || "Semthing went wrong!");
    }
  };

  const handleFileDelete = async (fileId) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/file/deletefile/${fileId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Semthing went wrong!");
        return;
      }
      toast.success("File deleted!");
      setRefetch((prev) => !prev);
    } catch (error) {
      toast.error(error.message || "Semthing went wrong!");
    }
  };

  const handleFilePriview = () => {};

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileName = selectedFile.name;
      let fileType = selectedFile.type;
      const fileSize = selectedFile.size;
      fileType = fileType.split("/")[1];
      console.log(fileType);
      setUploadFileName(fileName);
      setUploadFileType(fileType);
      setUploadFileSize(fileSize);
      setUploadFile(selectedFile);
    }
  };

  if(loading){
    return <div>
      Loading!
    </div>
  }

  if(!verifiedUser){
    return <EmptyState heading="You are not a verified user" subheading="Please log in to get access to your files" />
  }

  return (
    <div className="flex items-center p-4 flex-col">
      <div className="flex items-center gap-4 p-2 justify-between w-3/4">
        {folderHistory && folderHistory?.length > 0 && (
          <button
            onClick={handleGoBack}
            className="absolute bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            Back
          </button>
        )}
        <div className="flex gap-4 ml-20">
          <input
            type="text"
            placeholder="folder name"
            className="border p-3 rounded-lg"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
          <button
            onClick={handleFolderCreation}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            Create folder
          </button>
        </div>

        <div className="flex flex-col ">
          <div className="flex items-center gap-4">
            <label>
              <span className="text-4xl cursor-pointer">
                <FaFileUpload />
              </span>
              <input
                type="file"
                placeholder="file name"
                accept="image/*,.pdf"
                className="border p-3 rounded-lg hidden"
                onChange={handleFileChange}
              />
            </label>
            <button
              onClick={handleFileCreation}
              className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              Create file
            </button>
          </div>
          <span>{uploadFileName}</span>
        </div>
      </div>

      <div className="text-3xl font-bold uppercase underline ">
        {currentFolderName}
      </div>

      {folders?.length === 0 && files?.length === 0 && <EmptyState heading="This folder is empty!" subheading="Create new folder and files in this folder" />}

      <div className="flex flex-wrap gap-4 items-center justify-start w-full px-4 py-12">
        {folders &&
          folders.length > 0 &&
          folders.map((folder) => (
            <div key={folder._id}>
              <Folder
                folder={folder}
                onDelete={handleDeleteFolder}
                onRename={handleRemaneFolder}
                onOpen={handleOpenFolder}
              />
            </div>
          ))}
        {files &&
          files.length > 0 &&
          files.map((file) => (
            <div key={file._id}>
              <File
                file={file}
                onDelete={handleFileDelete}
                onRename={handleFileRename}
                onPreview={handleFilePriview}
                onMove={handleFileMove}
                currentFolderId={currentFolderId}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
