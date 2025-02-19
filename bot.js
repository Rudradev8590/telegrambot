const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const multer = require("multer");
const fs = require("fs");

// ✅ Replace with your actual Telegram bot token & chat ID
const TELEGRAM_BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN";
const CHAT_ID = "YOUR_TELEGRAM_CHAT_ID"; // Use your chat ID or group ID

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
const app = express();

// 🔹 Middleware for handling file uploads
const upload = multer({ dest: "uploads/" });

app.use(express.static("public")); // Serve website files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Route to receive images from the website
app.post("/send-photo", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded!" });
        }

        // Send the image to Telegram
        await bot.sendPhoto(CHAT_ID, fs.createReadStream(req.file.path), {
            caption: "📸 New Image Captured from Website",
        });

        // Remove the file after sending
        fs.unlinkSync(req.file.path);

        res.json({ message: "Image sent successfully!" });
    } catch (error) {
        console.error("Error sending image:", error);
        res.status(500).json({ message: "Error sending image" });
    }
});

// 🔹 Start Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
