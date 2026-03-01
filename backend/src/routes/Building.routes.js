import express from 'express';
import {
  addBuilding,
  deleteBuilding,
  getAllBuildings,
  getBuildingById,
  updateBuilding,
} from '../controller/Building.controller.js';

const router = express.Router();

router.post('/add', addBuilding);
router.get('/all', getAllBuildings);
router.get('/:id', getBuildingById);
router.patch('/:id', updateBuilding);
router.delete('/delete/:id', deleteBuilding);

export default router;
