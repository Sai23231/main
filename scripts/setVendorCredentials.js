import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import VendorList from '../server/models/Vendor.model.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db'; // update as needed
const DEFAULT_PASSWORD = 'vendor123'; // set your default password here
const DOMAIN = 'yourdomain.com'; // set your domain here

async function setCredentials() {
  await mongoose.connect(MONGODB_URI);

  const vendors = await VendorList.find({ $or: [ { email: { $exists: false } }, { email: '' } ] });

  for (const vendor of vendors) {
    // Use phone as unique email if possible
    const email = vendor.contact?.phone ? `${vendor.contact.phone}@${DOMAIN}` : `${vendor.name.replace(/\s+/g, '').toLowerCase()}@${DOMAIN}`;
    vendor.email = email;
    vendor.password = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    vendor.isClaimed = true;
    await vendor.save();
    console.log(`Set credentials for ${vendor.name}: ${vendor.email} / ${DEFAULT_PASSWORD}`);
  }

  mongoose.disconnect();
}

setCredentials(); 