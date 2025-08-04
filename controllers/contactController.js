const Contact = require('../models/Contact');
const User = require('../models/User');

const createContact = async (req, res) => {
  try {
    const { name, email, tags } = req.body;
    const userId = req.headers['x-user-id']; // TEMP: from frontend
    if (!userId) return res.status(401).json({ error: 'Missing user ID' });

    const contact = await Contact.create({ name, email, tags, user: userId });
    res.status(201).json(contact);
  } catch (err) {
    console.error('Create contact error:', err.message);
    res.status(500).json({ error: 'Failed to create contact' });
  }
};

const getContacts = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Missing user ID' });

    const contacts = await Contact.find({ user: userId }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error('Get contacts error:', err.message);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

const deleteContact = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const contactId = req.params.id;

    const contact = await Contact.findOneAndDelete({ _id: contactId, user: userId });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    res.json({ success: true });
  } catch (err) {
    console.error('Delete contact error:', err.message);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
};

module.exports = {
  createContact,
  getContacts,
  deleteContact
};
