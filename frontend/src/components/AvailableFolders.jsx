import React, { useEffect, useState } from "react";
import { SERVER_URL } from "../App";

const AvailableFolders = ({ folderId, fileId, onMove }) => {
  const [folders, setFolders] = useState([]);
  useEffect(() => {
    const fetAvailableFolders = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/folder/allbutone/${folderId}`,{
            credentials: "include"
        });
        const data = await res.json();
        if (!res.ok) {
          console.log("Something went wrong!");
        }
        // console.log(data);
        setFolders(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetAvailableFolders();
  }, []);

//   console.log(folders);

  return (
    <div className=" ml-8">
      <div className="border backdrop-blur rounded-lg p-4 bg-slate-100 opacity-60">
        {folders &&
          folders.length > 0 &&
          folders.map((folder) => <div onClick={() => onMove(fileId,folder._id)} key={folder._id} className="text-lg capitalize cursor-pointer font-semibold border-b-2 hover:font-bold">{folder.folderName}</div>)}
      </div>
    </div>
  );
};

export default AvailableFolders;
