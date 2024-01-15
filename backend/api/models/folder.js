import mongoose from "mongoose";

const folderSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    folderName: {
        type: String,
        required: true,
        unique: true,
    },
    parentFolderId: {
        type: String,  // reference to the id of another Folder document in this collection
        default: "root", // root folder
    },
}, {timestamps: true})

const Folder = mongoose.model('Folder', folderSchema)

export default Folder