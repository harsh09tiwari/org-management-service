import express from 'express';

const router = express.Router();

router.post("/org/create", createOrganization);

export default router;