'use strict';

const { Router } = require('express');
const controller = require('../controllers/monitorController');

const router = Router();

router.post('/', controller.create);
router.get('/', controller.list);

router.get('/stats', controller.stats);



module.exports = router;
