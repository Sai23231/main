import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

// Load environment variables
dotenv.config();

// Import DB connection
import connectDB from "./db/connectDb.js";

// Import Routes
import payment from "./routes/payment.js";
import questionnaire from "./routes/questionnaire.js";
import userRoutes from "./routes/user.route.js";
import vendorRoutes from "./routes/vendor.register.route.js";
import packageRoutes from "./routes/packageRoutes.js";
import reminderRoutes from "./routes/reminder.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import activityRoutes from "./routes/activityRoutes.js";
import budgetRouter from "./routes/budget.routes.js";
import guestRouter from "./routes/guest.router.js";
import taskRouter from "./routes/task.routes.js";
import teamMemberRouter from "./routes/teamMember.routes.js";
import checklistTaskRouter from "./routes/checklistTasks.routes.js";
import venueRouter from "./routes/venue.routes.js";
import vendorRouter from "./routes/vendor.routes.js";
import reviewRouter from "./routes/review.routes.js";
import eventRoutes from "./routes/event.routes.js";
import sponsorRoutes from "./routes/sponsor.routes.js";
import proposalRoutes from "./routes/proposal.routes.js";
import volunteerRoutes from "./routes/volunteer.routes.js";
import eventVolunteerRoutes from "./routes/eventVolunteer.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import customPackageRoutes from './routes/customPackage.routes.js';
import bookingInquiryRoutes from './routes/bookingInquiry.routes.js';
import serviceInquiryRoutes from './routes/serviceInquiry.routes.js';
import updateRequestRoutes from './routes/updateRequest.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';

// Initialize app
const app = express();
const PORT = process.env.PORT || 8001;

// Connect to DB
connectDB();

// Middlewares with increased payload limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static("public"));

app.use(
  cors({
    origin: ["http://localhost:5173", "https://dreamwedz.in"], // Allow both localhost and production
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Create HTTP and WebSocket server
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "https://dreamwedz.in",
    credentials: true,
  },
  transports: ["websocket"],
});

// WebSocket Events
io.on("connection", (socket) => {
  console.log("A user connected via WebSocket");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Export for use elsewhere if needed
export { server, io };

// Default API welcome route
app.get("/", (req, res) => {
  res.send("Welcome to DreamWeds API");
});

// Register routes
app.use("/api/user", userRoutes);
app.use("/api/questionnaire", questionnaire);
app.use("/api/payment", payment);
app.use("/api/vendor", vendorRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/guests", guestRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/teamMembers", teamMemberRouter);
app.use("/api/checklistTasks", checklistTaskRouter);
app.use("/api/budget", budgetRouter);
app.use("/api/venue", venueRouter);
app.use("/api/vendors", vendorRouter);
app.use("/api/review", reviewRouter);
app.use("/api/events", eventRoutes);
app.use("/api/sponsor", sponsorRoutes);
app.use("/api/proposal", proposalRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/eventVolunteer", eventVolunteerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/custom-package', customPackageRoutes);
app.use('/api/booking-inquiry', bookingInquiryRoutes);
app.use('/api/service-inquiry', serviceInquiryRoutes);
app.use('/api/update-request', updateRequestRoutes);
app.use('/api/portfolio', portfolioRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Request entity too large. Please reduce the size of your request.',
      error: 'PayloadTooLargeError'
    });
  }
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format in request body.',
      error: 'InvalidJSONError'
    });
  }
  
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
