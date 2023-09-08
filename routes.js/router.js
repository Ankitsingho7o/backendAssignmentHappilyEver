const express = require("express");
const { auth, isDeen, isstudent } = require("../middleware/auth");
const { logIn, availableAppointements, viewAppointements, bookAppointements, singUp, createSlot } = require("../controllers.js/auth");

const router  = express.Router();
router.post("/singup",singUp);
router.post("/login",logIn);
router.get("/availableAppointements",availableAppointements);
router.get("/viewAppointements",auth,isDeen,viewAppointements);
router.put("/bookAppointement",auth,isstudent,bookAppointements);
router.post("/createSlot",auth,isDeen,createSlot);
module.exports =  router;   