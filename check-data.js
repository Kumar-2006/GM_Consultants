require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gm-consultants';
const redactedUri = mongoUri.replace(/\/\/([^@]*@)/, '//***@');

console.log(`Connecting to MongoDB: ${redactedUri}`);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n=== Collections in database ===');
    collections.forEach(col => console.log('-', col.name));
    
    // Check Services
    const Service = mongoose.model('Service', new mongoose.Schema({}, { strict: false }));
    const services = await Service.find();
    console.log(`\n=== Services (${services.length} found) ===`);
    services.forEach(s => console.log(`- ${s.title}`));
    
    // Check Guidelines
    const Guideline = mongoose.model('Guideline', new mongoose.Schema({}, { strict: false }));
    const guidelines = await Guideline.find();
    console.log(`\n=== Guidelines (${guidelines.length} found) ===`);
    guidelines.forEach(g => console.log(`- ${g.title}`));
    
    // Check Consultations
    const Consultation = mongoose.model('Consultation', new mongoose.Schema({}, { strict: false }));
    const consultations = await Consultation.find();
    console.log(`\n=== Consultations (${consultations.length} found) ===`);
    consultations.forEach(c => console.log(`- ${c.name} (${c.email})`));
    
    // Check Admin Users
    const AdminUser = mongoose.model('AdminUser', new mongoose.Schema({}, { strict: false }));
    const admins = await AdminUser.find();
    console.log(`\n=== Admin Users (${admins.length} found) ===`);
    admins.forEach(a => console.log(`- ${a.username}`));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection closed');
  }
});
