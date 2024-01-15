import File from "../models/file.js";
import Folder from "../models/folder.js";

export const getRootFolders = async (req, res) => {
  const root = "root"
  try {
    const folders = await Folder.find({ parentFolderId: root });
    const files = await File.find({ folderId: root });
    console.log(files,folders)

    res.status(200).json({
      message: "Contents fetched successfully",
      files: files,
      folders: folders,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export const getFolder = async (req, res) => {
  const folderId = req.params.folderId;
  try {
    // Fetching all files in the folder
    const files = await File.find({ folderId: folderId });
    // Fetching all subfolders in the folder
    const folders = await Folder.find({ parentFolderId: folderId });
    res.status(200).json({
      message: "Contents fetched successfully",
      files: files,
      folders: folders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching folder contents", error: error });
  }
};

export const getAllButOne = async (req, res) => {
  const excludeFolderId = req.params.folderId;
  if(excludeFolderId === 'root'){
    try {
      const folders = await Folder.find({})
      res.status(200).json(folders)
    } catch (error) {
      res.status(500).send({ message: 'Error retrieving folders', error: error.message });
    }
  }
  else{
    try {
      const folders = await Folder.find({ _id: { $ne: excludeFolderId } });
      res.status(200).json(folders);
    } catch (error) {
      res.status(500).send({ message: 'Error retrieving folders', error: error.message });
    }
  }
};


export const createFolder = async (req, res) => {
  const newFolder = new Folder(req.body);
  try {
    await newFolder.save();
    res.status(201).json({folder:newFolder});
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const renameFolder = async (req, res) => {
  let folderId = req.params.folderId;
  let updatedFile;
  try {
    updatedFile = await Folder.findByIdAndUpdate(
      folderId,
      {
        $set: {
          folderName: req.body.newName,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedFile);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};


export const deleteFolder = async (req, res) => {
  let folderId = req.params.folderId;
  const deleteFolderContents = async (folderId) => {
    // Delete all files in the folder
    await File.deleteMany({ folderId: folderId });
    // Find all subfolders
    const subfolders = await Folder.find({ parentFolderId: folderId });
    for (const subfolder of subfolders) {
      // Recursively delete each subfolder and its contents
      await deleteFolderContents(subfolder._id);
    }
    // After all contents are deleted, delete the folder itself
    await Folder.findByIdAndDelete(folderId);
  };
  try {
    await deleteFolderContents(folderId);
    res
      .status(200)
      .json({ message: "Folder and all contents deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting folder", error: error.message });
  }
};
