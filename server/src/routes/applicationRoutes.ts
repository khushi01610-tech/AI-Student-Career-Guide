import { Router } from "express";
import { 
  getApplications, 
  createApplication, 
  updateApplication, 
  deleteApplication 
} from "../controllers/applicationController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.get("/", getApplications);
router.post("/", createApplication);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;
