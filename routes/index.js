import express from 'express'
import { addShip } from '../controllers/addShip'
import attack from '../controllers/attack'
import reset from '../controllers/reset'
import home from '../controllers/home'
const router = express.Router();

/* GET home page. */
router.get('/', home);

router.get('/reset', reset);

router.post('/ship', addShip);

router.post('/attack', attack);

export default router;
