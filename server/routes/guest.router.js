import { Router } from "express";
import {
  getGuests,
  addGuest,
  updateGuest,
  deleteGuest,
  toggleRSVP,
  addWishMessage,
  uploadPhoto,
  getGuestById,
  addUserGuest,
  getUserGuests
} from "../controllers/guest.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.route("/")
    .get(getGuests)
    .post(addGuest);

router.route("/addUserGuest").post(verifyToken, addUserGuest)
router.route("/getUserGuests").get(verifyToken, getUserGuests)

router.route("/:id")
    .get(getGuestById)
    .put(updateGuest)
    .delete(deleteGuest);

router.route("/:id/rsvp").put(toggleRSVP);
router.route("/:id/wish").post(addWishMessage);
router.route("/:id/photo").post(uploadPhoto);

export default router;
