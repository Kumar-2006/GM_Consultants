const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Service = require('./backend/models/Service');
const Guideline = require('./backend/models/Guideline');
const AdminUser = require('./backend/models/AdminUser');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.error('MONGODB_URI is not defined. Set the Atlas connection string before running setup-db.js.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample data
const sampleServices = [
  {
    title: 'Building Plan Approval',
    description: 'Complete assistance with building plan submissions, ensuring compliance with local building codes and regulations. We handle all documentation and coordinate with relevant authorities.',
    imageURL: ''
  },
  {
    title: 'Layout Plan Submission',
    description: 'Expert guidance for layout plan preparation and submission to relevant authorities. Our team ensures your layout meets all zoning requirements and statutory norms.',
    imageURL: ''
  },
  {
    title: 'Statutory Compliance Review',
    description: 'Thorough review of your plans to ensure they meet all statutory requirements and regulations. We identify potential issues before submission to avoid delays.',
    imageURL: ''
  },
  {
    title: 'Document Verification Assistance',
    description: 'Comprehensive verification of all required documents and assistance with documentation processes. We ensure all paperwork is complete and accurate.',
    imageURL: ''
  },
  {
    title: 'Zoning Consultation',
    description: 'Expert advice on zoning regulations and land use requirements. We help you understand zoning restrictions and opportunities for your property.',
    imageURL: ''
  },
  {
    title: 'Building Code Compliance',
    description: 'Detailed analysis of building codes and safety requirements. We ensure your plans meet all structural, fire safety, and accessibility standards.',
    imageURL: ''
  }
];

const sampleGuidelines = [
  {
    title: 'FSI (Floor Space Index) Rules',
    content: 'FSI determines the maximum built-up area allowed on a plot. It varies by location and zone type. Residential areas typically have FSI between 1.0-2.5, while commercial areas may have higher FSI. Always check with local authorities for specific FSI applicable to your plot. Consider factors like road width, plot size, and surrounding development when calculating permissible construction area.'
  },
  {
    title: 'Zoning Norms and Regulations',
    content: 'Zoning regulations define how land can be used in different areas. Common zones include Residential (R1, R2, R3), Commercial (C1, C2), Industrial (I1, I2), and Mixed Use. Each zone has specific restrictions on building height, setbacks, parking requirements, and permitted uses. Violation of zoning norms can result in rejection of plans or legal issues.'
  },
  {
    title: 'Setback Requirements',
    content: 'Setbacks are minimum distances that buildings must maintain from property boundaries. Front setback is typically 6-9 meters, side setbacks 3-6 meters, and rear setback 3-6 meters depending on plot size and zone. These requirements ensure proper ventilation, light, and emergency access. Setback violations are strictly penalized and can lead to demolition orders.'
  },
  {
    title: 'Parking Requirements',
    content: 'Minimum parking spaces are mandated based on building type and size. Residential buildings require 1-2 parking spaces per unit, commercial buildings need 1 space per 50-100 sq.m of built area, and offices require 1 space per 25-50 sq.m. Parking must be provided within the plot boundaries and should not obstruct fire access routes.'
  },
  {
    title: 'Fire Safety Regulations',
    content: 'All buildings must comply with fire safety norms including fire exits, staircases, fire fighting equipment, and emergency lighting. Buildings above 15m height require additional fire safety measures like fire pumps, sprinkler systems, and fire alarm systems. Fire department clearance is mandatory before occupancy certificate issuance.'
  },
  {
    title: 'Environmental Clearances',
    content: 'Projects above certain thresholds require environmental clearances from State/National authorities. Residential projects above 20,000 sq.m or commercial projects above 1,00,000 sq.m need Environmental Impact Assessment (EIA). Smaller projects may need Consent to Establish and Operate from Pollution Control Board.'
  },
  {
    title: 'Structural Design Requirements',
    content: 'All buildings must be designed by licensed structural engineers following relevant codes (IS 456, IS 1893, IS 875). Structural drawings must be certified and submitted for approval. Special requirements apply for seismic zones, high-rise buildings, and buildings with unusual loads or configurations.'
  },
  {
    title: 'Accessibility Standards',
    content: 'Buildings must comply with accessibility standards for persons with disabilities. This includes ramps, elevators, accessible toilets, and tactile indicators. Commercial and public buildings have stricter accessibility requirements. Non-compliance can result in rejection of plans or denial of occupancy certificates.'
  }
];

// Initialize database
const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');
    
    // Clear existing data
    await Service.deleteMany({});
    await Guideline.deleteMany({});
    await AdminUser.deleteMany({});
    console.log('Cleared existing data');
    
    // Insert sample services
    const services = await Service.insertMany(sampleServices);
    console.log(`Inserted ${services.length} services`);
    
    // Insert sample guidelines
    const guidelines = await Guideline.insertMany(sampleGuidelines);
    console.log(`Inserted ${guidelines.length} guidelines`);
    
    // Create admin user
    const adminUser = new AdminUser({
      username: 'Chandramohan',
      password: '5655'
    });
    await adminUser.save();
    console.log('Created admin user: Chandramohan/5655');
    
    console.log('\n✅ Database initialization completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Services: ${services.length}`);
    console.log(`- Guidelines: ${guidelines.length}`);
    console.log('- Admin User: Chandramohan/5655');
    console.log('\n🚀 You can now start the server with: npm start');
    
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run initialization
const runSetup = async () => {
  await connectDB();
  await initializeDatabase();
};

runSetup();
