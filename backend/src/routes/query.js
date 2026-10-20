const router = require('express').Router();
const { handleQuery } = require('../controllers/queryController');
router.post('/', handleQuery);
module.exports = router;