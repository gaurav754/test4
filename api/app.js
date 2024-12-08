const QRCode = require("qrcode");
const express = require("express");
const path = require("path");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
require("./db/conn");
const User = require("./models/users");
const crypto = require("crypto");

const port = process.env.PORT || 3000;

// Paths
const static_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));

// Setting the view engine and views directory
app.set("view engine", "hbs");
app.set("views", views_path);

// Routes
app.get("/index", (req, res) => {
    res.render("index");
});

app.get("/regist", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/regist.html"));
});

app.post("/regist", async (req, res) => {
    try {
        if (req.body.password !== req.body['confirm-password']) {
            return res.status(400).send("Passwords do not match.");
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            userId: req.body['user-id'],
            password: hashedPassword,
            firstName: req.body['first-name'],
            lastName: req.body['last-name'],
            email: req.body.email,
            phoneNumber: req.body['phone-number'],
            address: {
                line1: req.body.address,
                line2: req.body.address2 || null,
                city: req.body.city || null,
                state: req.body.state || null,
                zip: req.body.zip || null,
            },
            birthDate: {
                month: req.body.month,
                day: parseInt(req.body.day, 10),
                year: parseInt(req.body.year, 10),
            },
            referral: req.body.referral || [],
            membership: req.body.membership,
            contactPreference: req.body.contactDetails,
            rulesAccepted: req.body.rules === 'on',
            privacyPolicyAccepted: req.body['privacy-policy'] === 'on',
        });

        await newUser.save();

        res.render("signIn", {
            successMessage: `User registered successfully. Please sign in!`
        });
    } catch (error) {
        console.error("Error occurred in /regist:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).send(`Validation error: ${error.message}`);
        }
        res.status(500).send("An error occurred during registration. Please try again later.");
    }
});

app.get("/signIn", (req, res) => {
    res.render("signIn");
});

app.post("/signIn", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userEmail = await User.findOne({ email: email });

        if (!userEmail) {
            return res.status(401).send("Invalid Credentials");
        }

        const isMatch = await bcrypt.compare(password, userEmail.password);
        if (!isMatch) {
            return res.status(401).send("Invalid Credentials");
        }

        const qrCodeData = userEmail._id.toString();  // Use the user ID to generate QR
        const qrCodeImage = await QRCode.toDataURL(qrCodeData);

        res.render("qr", { qrCodeImage });
    } catch (error) {
        console.error("Error:", error);
        res.status(400).send("Invalid Details");
    }
});

app.get("/qr", async (req, res) => {
    try {
        const user = await User.findOne({ email: "userEmail@example.com" });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        const uniqueKey = user._id.toString();

        const qrCodeImage = await QRCode.toDataURL(uniqueKey);

        res.render("qr", {
            successMessage: "QR Code generated successfully!",
            qrCodeImage: qrCodeImage
        });
    } catch (error) {
        console.error("Error generating QR code:", error);
        res.status(500).send("Error generating QR code");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
