import express from 'express'
import { verifyUser } from '../utils/verifyUser.js'
import { uploadFile, renameAndMoveFile, getFile,deleteFile } from '../controllers/file.js'

const router = express.Router()

router.get("/:fileId", getFile)
router.post("/uploadfile", verifyUser, uploadFile)
router.post("/rename-movefile/:fileId", verifyUser, renameAndMoveFile)
router.delete("/deletefile/:fileId", verifyUser, deleteFile)

export default router