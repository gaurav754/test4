const mongoose = require('mongoose');

// Replace with your actual MongoDB Atlas connection string
const dbURI = "mongodb+srv://techblaster754:gaurav.754@cluster0.28etw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((err) => console.log("Error connecting to MongoDB Atlas", err));
