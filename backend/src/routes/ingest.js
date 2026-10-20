const router = require('express').Router();
const { handleIngest } = require('../controllers/ingestController');
router.post('/', handleIngest);
module.exports = router;