'use strict';

const { Router } = require('express');
const controller = require('../controllers/monitorController');

const router = Router();

router.post('/', controller.create);
router.get('/', controller.list);

router.get('/stats', controller.stats);

router.get('/:id', controller.getOne);
router.delete('/:id', controller.remove);

router.post('/:id/heartbeat', controller.heartbeat);
router.post('/:id/pause', controller.pause);
router.post('/:id/resume', controller.resume);

module.exports = router;
