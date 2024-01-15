import mongoose from 'mongoose'

const fileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    folderId: {
        type: String,
        default: "root"
    },
    fileName: {
        type: String,
        required: true,
        unique: true,
    },
    fileType: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileSize: {
        type: String,
    },
    previewUrl: {
        type: String,
    },
},{timestamps: true})

const File = mongoose.model('File', fileSchema)

export default File