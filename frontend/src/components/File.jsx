import React, { useState } from "react";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { SlCursorMove } from "react-icons/sl";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import AvailableFolders from "./AvailableFolders";

const File = ({ file, onDelete, onMove, onRename, onPreview, currentFolderId }) => {
  const [showRename, setShowRename] = useState(false);
  const [name, setName] = useState(file.fileName);
  const [showAvailableFolders, setShowAvailableFolders] = useState(false)

  const handleShowRename = () => {
    setShowRename((prev) => !prev);
  };

  const handleShowAvailableFolders = () => {
    setShowAvailableFolders((prev) => !prev)
  }

  const fileName = file.fileName.split(".")[0];
  return (
    <div className="border border-black p-4 rounded-lg ">
      <div className="h-[300px] w-[280px]">
        {file.fileType === "pdf" ? (
          <img src="/pdf.png" height="100%" width="100%" alt="pdf" />
        ) : (
          <img src="/img.webp" height="100%" width="100%" alt="image" />
        )}
      </div>
      <span className="text-lg font-semibold capitalize">{fileName}</span>
      <div className="flex items-center justify-between text-xl border-t-2 pt-2">
        <Link to={file.previewUrl} target="_blank">
          <span className="text-3xl cursor-pointer text-slate-600 hover:text-slate-900">
            <FaEye />
          </span>
        </Link>
        <span
          onClick={handleShowRename}
          className="text-3xl cursor-pointer text-gray-600 hover:text-gray-800"
        >
          <MdDriveFileRenameOutline />
        </span>
        <span
          onClick={handleShowAvailableFolders}
          className="text-3xl cursor-pointer text-red-500 hover:text-red-700"
        >
          <SlCursorMove />
        </span>
        <span
          onClick={() => onDelete(file._id)}
          className="text-3xl cursor-pointer text-red-500 hover:text-red-700"
        >
          <MdDelete />
        </span>
      </div>
      {showRename && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="rename"
            className="border py-2 px-3 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={() => onRename(file._id, name, currentFolderId)}
            className="bg-slate-700 text-white px-3 py-2 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            Save
          </button>
        </div>
      )}

      {
        showAvailableFolders && (
          <div className="absolute">
            <AvailableFolders folderId={file.folderId} onMove={onMove} fileId={file._id} />
          </div>
        )
      }
    </div>
  );
};

export default File;
