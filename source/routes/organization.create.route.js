import express from 'express';
import { createOrganization, getOrganization } from '../controllers/organization.controller.js';

const router = express.Router();

router.post("/create", createOrganization);
router.get("/get", getOrganization);

export default router;