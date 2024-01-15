import React, { useState } from "react";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoMdOpen } from "react-icons/io";

const Folder = ({ folder, onDelete, onRename, onOpen }) => {
  const [showRename, setShowRename] = useState(false);
  const [name, setName] = useState('')

  const handleShowRename = () => {
    setShowRename((prev) => !prev);
  };

  return (
    <div className="border border-black p-4 rounded-lg">
      <div className="h-[300px] w-[280px]">
        <img src="/folder.jpg" height="100%" width="100%" alt="folder" />
      </div>
      <span className="text-lg font-semibold capitalize">
        {folder.folderName}
      </span>
      <div className="flex items-center justify-between text-xl border-t-2 pt-2">
        <span onClick={() => onOpen(folder._id, folder.folderName)} className="text-3xl cursor-pointer text-slate-600 hover:text-slate-900">
          <IoMdOpen />
        </span>
        <span
          onClick={handleShowRename}
          className="text-3xl cursor-pointer text-gray-600 hover:text-gray-800"
        >
          <MdDriveFileRenameOutline />
        </span>
        <span onClick={() => onDelete(folder._id)} className="text-3xl cursor-pointer text-red-500 hover:text-red-700">
          <MdDelete />
        </span>
      </div>
      {showRename && <div className="mt-2 flex gap-2">
        <input
          type="text"
          placeholder="rename"
          className="border p-2 rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={() => onRename(folder._id, name)} className="bg-slate-700 text-white p-2 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Save</button>

      </div>}
    </div>
  );
};

export default Folder;
