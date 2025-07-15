const express = require('express');
const router = express.Router();
const {
TestApicreatepost,TestApiget, TestApiupdate, TestApidelete
} = require('../controller/testapi');



// router.post('/testapipost', TestApicreate);
router.post('/tanklevelpost', TestApicreatepost);
router.get('/tanklevelget',TestApiget);
router.put('/tanklevelupdate/:id',TestApiupdate);
router.delete('/tankleveldelete/:id',TestApidelete);

module.exports = router;