import express from 'express';
//import LOGS from './Midware/logs';
import INVENTORY from './Routes/Inventory';
import RESULTS from './Routes/Results';
import {LCAProject} from '../DB/schemas/project';
import { connectDB } from '../DB/MDB';
import cors from 'cors';
// Import all process models
import { 
  Extraction, 
  Transportation, 
  Refining, 
  Smelting, 
  Casting, 
  Recycling,
  EndOfLife
} from '../DB/models';
// Import process templates
import processTemplates from './data/processTemplates.json';

const app = express();

// Middleware setup - order is important
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies


app.use(cors({
  origin: 'https://metalyticsai-fe.onrender.com', // your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // if you use cookies/auth
}));

// Connect to MongoDB
connectDB();

// Add a root route
app.get('/', (req, res) => {
  res.status(200).send({
    message: 'LCA Backend API Server',
    status: 'Running',
    version: '1.0.0',
    endpoints: {
      projects: '/api/project',
      inventory: '/api/inventory',
      results: '/api/results'
    },
    documentation: 'Visit /api/project for project management endpoints'
  });
});

// Helper function to create empty process documents
const createEmptyProcessDocuments = async (metalType: string, projectId: string) => {
  try {
    // Create empty extraction document
    const extraction = new Extraction({
      metal: metalType,
      ...processTemplates.extraction
    });

    // Create empty transportation documents (3 different stages)
    const transportToRefinery = new Transportation(processTemplates.transportation);
    const transportToConsumer = new Transportation(processTemplates.transportation);

    // Create empty refining document
    const refining = new Refining(processTemplates.refining);

    // Create empty smelting document - use metal-specific template if available
    const smeltingTemplates = processTemplates.smelting as Record<string, typeof processTemplates.smelting.default>;
    const smeltingTemplate = smeltingTemplates[metalType] ?? smeltingTemplates["default"];
    const smelting = new Smelting(smeltingTemplate);

    // Create empty casting document
    const casting = new Casting(processTemplates.casting);

    // Create empty recycling document
    const recycling = new Recycling(processTemplates.recycling);
    const endOfLife = new EndOfLife(processTemplates.endOfLife);

    // Save all process documents
    const savedExtraction = await extraction.save();
    const savedTransportToRefinery = await transportToRefinery.save();
    const savedRefining = await refining.save();
    const savedSmelting = await smelting.save();
    const savedCasting = await casting.save();
    const savedTransportToConsumer = await transportToConsumer.save();
    const savedRecycling = await recycling.save();
    const savedEndOfLife = await endOfLife.save();


    return {
      extraction: {
      processId: savedExtraction._id,
      description: `${metalType} extraction process`
      },
      transportToRefinery: {
      processId: savedTransportToRefinery._id,
      description: `Transportation to refinery`
      },
      refining: {
      processId: savedRefining._id,
      description: `${metalType} refining process`
      },
      smelting: {
      processId: savedSmelting._id,
      description: `${metalType} smelting process`
      },
      casting: {
      processId: savedCasting._id,
      description: `${metalType} casting process`
      },
      transportToConsumer: {
      processId: savedTransportToConsumer._id,
      description: `Transportation to consumer`
      },
      usagePhase: {
      processId: null,
      description: `${metalType} usage phase`,
      ...processTemplates.usagePhase
      },
      recycling: {
      processId: savedRecycling._id,
      description: `${metalType} recycling process`
      },
      endOfLife: {
      processId: savedEndOfLife._id,
      description: `${metalType} end of life`,
      }
    };
  } catch (error) {
    console.error('Error creating process documents:', error);
    throw error;
  }
};

// Create router after middleware setup
const router = express.Router();

   // enum: ["Cradle-to-Gate", "Cradle-to-Grave", "Gate-to-Gate", "Cradle-to-Cradle"]


router.post('/init', async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug log
    console.log('Content-Type:', req.headers['content-type']); // Debug log
    
    // Check if req.body exists
    if (!req.body) {
      return res.status(400).send({ error: 'Request body is missing or not parsed' });
    }
    
    let { projectName, metalType, goal, systemBoundary, functionalUnit } = req.body;
    
    if (!projectName || !metalType || !systemBoundary ) {
      return res.status(400).send({ 
        error: 'Missing required fields: projectName, metalType, systemBoundary',
        received: { projectName, metalType, systemBoundary }
      });
    }
    
    if (!functionalUnit) { functionalUnit = "1 tonne" }
    if (!goal || goal.length < 3) { 
      goal = `To assess the environmental impact of producing ${functionalUnit} of primary ${metalType} ingot.`
    }

    // Create the main project document first
    let inv_meta;
    switch (systemBoundary) {
      case "Cradle-to-Gate":inv_meta = {
        extraction: 1,
        Tport_to_refinary: 1,
        refining: 1,
        smelting: 1,
        Casting: 0,
        Tport_to_consumer: 0,
        usage_phase: 0,
        Recycle: 0,
        end_of_life: 0
      }; break;
      case "Cradle-to-Grave": inv_meta = {
        extraction: 1,
        Tport_to_refinary: 1,
        refining: 1,
        smelting: 1,
        Casting: 1,
        Tport_to_consumer: 1,
        usage_phase: 0,
        Recycle: 0,
        end_of_life: 1
      }; break;

      case "Cradle-to-Cradle": inv_meta = {
        extraction: 1,
        Tport_to_refinary: 1,
        refining: 1,
        smelting: 1,
        Casting: 1,
        Tport_to_consumer: 1,
        usage_phase: 1,
        Recycle: 1,
        end_of_life: 1
      }; break;
      default:
        return res.status(400).send({ error: 'Invalid systemBoundary value' });
    }

    const newProject = new LCAProject({
      projectName,
      metalType,
      goal,
      systemBoundary,
      functionalUnit,
      meta: {
        createdBy: { name: "JNARDDC" },
        inventory:inv_meta,
        status: "Draft"
      }
    });

    const savedProject = await newProject.save();

    // Create all empty process documents
    const inventoryData = await createEmptyProcessDocuments(metalType, savedProject._id.toString());

    // Update the project with inventory data
    savedProject.inventoryData = inventoryData;
    await savedProject.save();

    res.status(201).send({ 
      message: 'LCA project initialized successfully with complete structure',
      id: savedProject._id.toString(),
      projectData: {
        projectName,
        metalType,
        goal,
        systemBoundary,
        functionalUnit,
        status: "Draft"
      },
      inventoryStructure: {
        extraction: inventoryData.extraction.processId,
        transportToRefinery: inventoryData.transportToRefinery.processId,
        refining: inventoryData.refining.processId,
        smelting: inventoryData.smelting.processId,
        casting: inventoryData.casting.processId,
        transportToConsumer: inventoryData.transportToConsumer.processId,
        recycling: inventoryData.recycling.processId,
        endOfLife: inventoryData.endOfLife.processId
      }
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).send({ error: 'Failed to create project' });
  }
});

// Get all projects - put this BEFORE the /:id route
router.get('/all', async (req, res) => {
  console.log('Retrieving all projects');
  try {
    const projects = await LCAProject.find().select('projectName metalType goal systemBoundary meta.status meta.createdAt');
    
    res.status(200).send({
      message: 'Projects retrieved successfully',
      projects: projects
    });
  } catch (error) {
    console.error('Error retrieving projects:', error);
    res.status(500).send({ error: 'Failed to retrieve projects' });
  }
});

// Get project by ID with populated inventory data
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await LCAProject.findById(id)
      .populate('inventoryData.extraction.processId')
      .populate('inventoryData.transportToRefinery.processId')
      .populate('inventoryData.refining.processId')
      .populate('inventoryData.smelting.processId')
      .populate('inventoryData.casting.processId')
      .populate('inventoryData.transportToConsumer.processId')
      .populate('inventoryData.recycling.processId')
      .populate('inventoryData.endOfLife.processId');

    if (!project) {
      return res.status(404).send({ error: 'Project not found' });
    }

    res.status(200).send({
      message: 'Project retrieved successfully',
      project: project
    });
  } catch (error) {
    console.error('Error retrieving project:', error);
    res.status(500).send({ error: 'Failed to retrieve project' });
  }
});

// Mount the router
app.use('/api/project', router);

// app.use('/api/auth', LOGS);
app.use("/api/inventory", INVENTORY);
app.use("/api/results", RESULTS);


app.listen(process.env.PORT, () => {
  console.log('Server is running on port 5000');
});