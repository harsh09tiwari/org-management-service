import express from 'express';
import { createOrganization, deleteOrganization, getOrganization, updateOrganization } from '../controllers/organization.controller.js';

const router = express.Router();

router.post("/create", createOrganization);
router.get("/get", getOrganization);
router.delete("/delete", deleteOrganization)
router.put("/update/", updateOrganization);

export default router;