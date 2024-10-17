const express = require('express');
const router = express.Router();
const usaTemuanController = require('../controllers/usaTemuanController');

// Define routes
router.get('/', usaTemuanController.getAllUSATemuan);
router.get('/:id', usaTemuanController.getUSATemuanById);
router.post('/', usaTemuanController.createUSATemuan);
router.patch('/:id', usaTemuanController.updateUSATemuan);
router.delete('/:id', usaTemuanController.deleteUSATemuan);

module.exports = router;

