import Address from '../models/address.model.js';

export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user.id; // ✅ secure

    await Address.create({ ...address, userId });
    res.json({ success: true, message: 'Address added successfully' });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({ userId });

    res.json({ success: true, addresses });
  } catch (error) {
    console.log('getAddress error:', error.message);
    res.json({ success: false, message: error.message });
  }
};
