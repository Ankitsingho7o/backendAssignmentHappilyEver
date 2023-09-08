const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const slot = require("../models/slot");

require("dotenv").config();

exports.singUp = async (req, res) => {
    try {
        const { universityId, name, role, password } = req.body;
        console.log(universityId);
        if (!name || !role || !universityId || !password) {
            return res.status(404).json({
                success: false,
                message: "Please Provide All fields"
            });
        }
        // checking if user already exist or not 
        const existing = await user.find({ universityId })
        if (existing.length > 0) {
            return res.status(409).json({ error: "user alredy exist" })
        }

        let hashPassword;
        try {

            hashPassword = await bcrypt.hash(password, 10);
        }
        catch (err) {
            console.log("Error occured in hashing password  : ", err);
        }

        await user.create({
            universityId, name, role, password: hashPassword
        });

        return res.status(200).json({
            success: true,
            message: "User Successfully created",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "singUP failed",
        });
    }
}

exports.logIn = async (req, res) => {
    try {

        const { universityId, password } = req.body;

        //checking all fields are filled 
        if (!universityId || !password) {
            return res.status(403).json({
                success: false,
                message: "Please fill all the fields"
            })
        }



        // check whether user exist or not
        const User = await user.findOne({ universityId });
        if (!User) {
            return res.status(401).json({
                success: false,
                message: "user is not registered",
            })
        }

        // check password
        const result = await bcrypt.compare(password, User.password);
        if (!result) {
            return res.status(401).json({
                success: false,
                message: "Wrong Password",
            })
        }

        // generating jsw token
        const payload = {
            universityId,
            id: User._id,
            role: User.role,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "2h" });

        User.token = token;
        User.password = undefined;

        // const options = {
        //     httpOnly: true,
        //     expire: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        // }
        // .cookie("login", token, options)

        res.status(200).json({
            success: true,
            message: "Logged In",
            token,
            User,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }

};

exports.viewAppointements = async (req, res) => {
    const currentMili = Date.now();
    const currentTime = new Date(currentMili);
    const hours = currentTime.getHours();
    console.log("current time is", hours);
    try {
        const userId = req.user.id;
        // const Appointments = await slot.find({ status: "booked", teacher: userId, }).populate("student").exec();
        const Appointments = await slot.find({
            status: "booked", startTime: {
                $gt: hours
            }, teacher: userId
        }).populate("student").exec();

        return res.status(200).json({
            success: true,
            Appointments: Appointments,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


exports.availableAppointements = async (req, res) => {
    try {
        const Slots = await slot.find({ status: "available" }).populate("teacher").exec();
        return res.status(200).json({
            success: true,
            AvailableSlots: Slots,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.bookAppointements = async (req, res) => {
    try {
        const slotId = req.header("slotId");
        const userId = req.user.id;
        if (!slotId) {
            return res.status(404).json({
                success: false,
                message: "Please provide all details",
            });
        }
        await slot.findByIdAndUpdate({ _id: slotId }, { student: userId, status: "booked" });

        return res.status(200).json({
            success: true,
            message: "Booked Successfully",
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.createSlot = async (req, res) => {
    try {
        const day = req.header("day");
        const startTime = req.header("startTime");
        const endTime = req.header("endTime");
        const status = "available";

        if (!day || !startTime || !endTime) {
            return res.status(404).json({
                success: false,
                message: "Fill All Details",
            });
        }

        const userId = req.user.id;

        const Slot = await slot.create({
            day, startTime, endTime, status, teacher: userId
        });

        return res.status(200).json({
            success: true,
            message: "Successfully Created",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

