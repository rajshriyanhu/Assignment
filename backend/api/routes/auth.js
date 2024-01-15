import express from 'express'
import { signup, signin, signout, verifiedUser } from '../controllers/auth.js'
import {verifyUser} from '../utils/verifyUser.js'

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.get("/signout", signout)
router.get("/verifyuser", verifyUser, verifiedUser)

export default router