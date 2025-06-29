import CustomPackage from '../models/CustomPackage.js';

export const createCustomPackage = async (req, res) => {
  try {
    const { userId, packageDetails, paymentId } = req.body;
    const pkg = await CustomPackage.create({ user: userId, packageDetails, paymentId });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserPackages = async (req, res) => {
  try {
    const { userId } = req.params;
    const pkgs = await CustomPackage.find({ user: userId }).sort({ createdAt: -1 });
    res.json(pkgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 