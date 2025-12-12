import express from 'express';
import { createOrganization, deleteOrganization, getOrganization } from '../controllers/organization.controller.js';

const router = express.Router();

router.post("/create", createOrganization);
router.get("/get", getOrganization);
router.delete("/delete", deleteOrganization)

export default router;