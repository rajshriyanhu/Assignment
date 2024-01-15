import File from "../models/file.js";

export const getFile = async (req, res) => {
    let file;
    try {
        file = await File.findById(req.params.fileId)
        res.status(200).json(file)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

export const uploadFile = async (req, res) => {
  const newFile = new File(req.body);
  try {
    await newFile.save();
    res.status(201).json({file:newFile});
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const renameAndMoveFile = async (req, res) => {
  let fileId = req.params.fileId;
  let updatedFile;
  const {newName, newFolderId} = req.body;
  if(newName){
    try {
      updatedFile = await File.findByIdAndUpdate(fileId,
        {
          $set: {
            fileName: req.body.newName,
          },
        },
        { new: true }
        );
        res.status(200).json(updatedFile);
      } catch (error) {
        return res.status(500).json(error.message);
      }
  }
  else if(newFolderId){
    try {
      updatedFile = await File.findByIdAndUpdate(fileId,
        {
          $set: {
            folderId: req.body.newFolderId,
          },
        },
        { new: true }
        );
        res.status(200).json(updatedFile);
      } catch (error) {
        return res.status(500).json(error.message);
      }
  }
  
  
};

export const deleteFile = async(req, res) => {
    let fileId = req.params.fileId;
    const file = await File.findById(fileId)
    if(!file){
        return res.status(404).json('No such file exists')
    }
    try {
        await File.findByIdAndDelete(fileId)
        res.status(200).json({message: "File has been deleted successfully"})
    } catch (error) {
        res.status(500).json(error.message)
    }
}

