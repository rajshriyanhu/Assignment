import express from 'express'
import { getFolder, createFolder, renameFolder, deleteFolder, getRootFolders, getAllButOne } from '../controllers/folder.js'
import { verifyUser } from '../utils/verifyUser.js'

const router = express.Router()

router.get("/:folderId",verifyUser, getFolder )
router.get("/rootfolders", verifyUser, getRootFolders)
router.get("/allbutone/:folderId",verifyUser, getAllButOne)
router.post("/createfolder",verifyUser,createFolder)
router.post("/renamefolder/:folderId",verifyUser,renameFolder)
router.delete("/deletefolder/:folderId", verifyUser, deleteFolder)

export default router