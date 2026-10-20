const router = require('express').Router();
const { handleGetRelated } = require('../controllers/relatedController');
router.get('/:itemId', handleGetRelated);
module.exports = router;