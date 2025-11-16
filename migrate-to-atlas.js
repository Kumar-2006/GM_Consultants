require('dotenv').config();
const mongoose = require('mongoose');

const Service = require('./backend/models/Service');
const Guideline = require('./backend/models/Guideline');
const Consultation = require('./backend/models/Consultation');
const AdminUser = require('./backend/models/AdminUser');

const localUri = process.env.LOCAL_MONGODB_URI;

if (!localUri) {
  console.error('LOCAL_MONGODB_URI must be set to run the migration script.');
  process.exit(1);
}
const atlasUri = process.env.MONGODB_URI;

const redactUri = (uri = '') => uri.replace(/:\/\/([^@]*@)/, '://***@');

if (!atlasUri) {
  console.error('Missing MONGODB_URI in environment. Aborting migration.');
  process.exit(1);
}

const fetchCollections = async () => {
  console.log(`Reading data from local MongoDB: ${localUri}`);
  const { connection } = await mongoose.connect(localUri, {
    serverSelectionTimeoutMS: 5000
  });

  const [services, guidelines, consultations, admins] = await Promise.all([
    Service.find().lean(),
    Guideline.find().lean(),
    Consultation.find().lean(),
    AdminUser.find().lean()
  ]);

  console.log(`Fetched ${services.length} services, ${guidelines.length} guidelines, ${consultations.length} consultations, ${admins.length} admin users.`);

  await connection.close();

  return { services, guidelines, consultations, admins };
};

const seedAtlas = async ({ services, guidelines, consultations, admins }) => {
  console.log(`Uploading data to Atlas: ${redactUri(atlasUri)}`);
  const { connection } = await mongoose.connect(atlasUri, {
    serverSelectionTimeoutMS: 10000
  });

  const collections = [
    { name: 'services', model: Service, data: services },
    { name: 'guidelines', model: Guideline, data: guidelines },
    { name: 'consultations', model: Consultation, data: consultations },
    { name: 'admin users', model: AdminUser, data: admins }
  ];

  for (const { name, model, data } of collections) {
    console.log(`Replacing ${name} collection (${data.length} documents)...`);
    await model.deleteMany({});
    if (data.length) {
      await model.insertMany(data, { ordered: true });
    }
  }

  await connection.close();
};

(async () => {
  try {
    const datasets = await fetchCollections();
    await seedAtlas(datasets);
    console.log('✅ Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    try {
      await mongoose.connection.close();
    } catch (closeError) {
      console.error('Error closing connection:', closeError);
    }
    process.exit(1);
  }
})();
