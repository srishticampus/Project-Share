import express from 'express';
import login from './login.js';
import registerAdmin from './registerAdmin.js';
import registerCreator from './registerCreator.js';
import registerCollaborator from './registerCollaborator.js';
import registerMentor from './registerMentor.js';

const router = express.Router();

router.use(login);
router.use(registerAdmin);
router.use(registerCreator);
router.use(registerCollaborator);
router.use(registerMentor);

export default router;
