const express = require('express');
const router = express.Router();
const {
TestApicreatepost,TestApiget, TestApiupdate, TestApidelete
} = require('../controller/testapi');



// router.post('/testapipost', TestApicreate);
router.post('/testapipost', TestApicreatepost);
router.get('/testapiget',TestApiget);
router.put('/testapiupdate/:id',TestApiupdate);
router.delete('/testapidelete/:id',TestApidelete);

module.exports = router;