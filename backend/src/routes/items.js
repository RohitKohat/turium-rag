const router = require('express').Router();
const { handleGetItems } = require('../controllers/itemsController');
router.get('/', handleGetItems);
module.exports = router;