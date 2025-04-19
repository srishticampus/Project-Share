import express from 'express';
import login from './login.js';
import registerAdmin from './registerAdmin.js';
import registerCreator from './registerCreator.js';
import registerCollaborator from './registerCollaborator.js';
import registerMentor from './registerMentor.js';
import profile from './profile.js';

const router = express.Router();

router.use(login);
router.use(registerAdmin);
router.use(registerCreator);
router.use(registerCollaborator);
router.use(registerMentor);
router.use(profile);

export default router;
