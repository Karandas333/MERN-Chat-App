const express = require('express');
const {verifyToken} = require('../middleware/authMiddleware.js');
const { searchContacts, getContactForDMList, getAllContacts } = require('../controllers/contact-controllr.js');


const contactsRoutes = express.Router();

contactsRoutes.post('/search', verifyToken, searchContacts);
contactsRoutes.get('/get-contacts-for-dm', verifyToken, getContactForDMList);
contactsRoutes.get('/get-all-contacts', verifyToken, getAllContacts);

module.exports = contactsRoutes