import  { useState } from 'react';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';

export default function Pinit() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [goal, setGoal] = useState("");
  const [metalType, setMetalType] = useState("");
  const [systemBoundary, setSystemBoundary] = useState("");
  const [functionalUnit, setFunctionalUnit] = useState("");
  const [stageCounter, setStageCounter] = useState(0);
  
  // Add missing state variables
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [projectResponse, setProjectResponse] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const initializeProject = async () => {
    if (!projectName || !metalType || !systemBoundary) {
      setError("Please fill in all required fields: Project Name, Metal Type, and System Boundary");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("https://metalyticsai-2.onrender.com/api/project/init", {
        projectName,
        metalType,
        goal,
        systemBoundary,
        functionalUnit
      });

      console.log("Project initialized successfully:", response.data);
      setProjectResponse(response.data);
      setShowSuccessModal(true);
      
    } catch (error: any) {
      console.error("Error initializing project:", error);
      setError(error.response?.data?.message || "Failed to initialize project");
    } finally {
      setIsLoading(false);
    }
  };

  const incrementCounter = () => {
    setStageCounter(stageCounter + 1);
  };

  const handleConfirmAndProceed = () => {
    setShowSuccessModal(false);
    setProjectResponse(null);
    incrementCounter();
    navigate(`/input/${projectResponse.id}`);
  };

  return (
    <>
      <div className="bg-gray-50 flex items-center justify-center mt-5">
        <div className="bg-white p-4 rounded-lg shadow-md max-w-[50vw] w-full space-y-6">
          {stageCounter === 0 && (
            <>
              <span className="text-2xl font-semibold text-center block">
                Project Initialisation
              </span>
              
              {/* Error and Success Messages */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  {success}
                </div>
              )}
              
              <input
                type="text"
                placeholder="Project Name *"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="border border-gray-400 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
              />
              
              <textarea
                placeholder="Goal of the LCA Study"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="border border-gray-400 rounded-md px-4 py-2 w-full h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white resize-none"
              />
              
              <select
                value={metalType}
                onChange={(e) => setMetalType(e.target.value)}
                className="border border-gray-400 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
              >
                <option value="" disabled>
                  Select Metal Type *
                </option>
                <option value="Aluminium">Aluminium</option>
                <option value="Copper">Copper</option>
                <option value="Lead">Lead</option>
                <option value="Zinc">Zinc</option>
                <option value="Iron">Iron</option>
                <option value="Steel">Steel</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
              </select>
              
              <select
                value={systemBoundary}
                onChange={(e) => setSystemBoundary(e.target.value)}
                className="border border-gray-400 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
              >
                <option value="" disabled>
                  Select System Boundary *
                </option>
                <option value="Cradle-to-Gate">Cradle to Gate</option>
                <option value="Cradle-to-Grave">Cradle to Grave</option>
                <option value="Cradle-to-Cradle">Cradle to Cradle</option>
                
              </select>
              
              <input
                type="text"
                placeholder="Functional Unit (e.g., 1 tonne)"
                value={functionalUnit}
                onChange={(e) => setFunctionalUnit(e.target.value)}
                className="border border-gray-400 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
              />
              
              {/* Initialize Project Button */}
              <button
                onClick={initializeProject}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors w-full"
              >
                {isLoading ? "Initializing..." : "Initialize Project"}
              </button>
              
              <div className="text-sm text-gray-500 text-center">
                <span className="text-red-500">*</span> Required fields
              </div>
            </>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && projectResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Project Initialized Successfully!
              </h2>
              <p className="text-gray-600">
                Your LCA project has been created with complete structure.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Project Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Project ID:</span>
                  <p className="text-gray-800 font-mono">{projectResponse.id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <p className="text-gray-800">{projectResponse.projectData?.status}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Project Name:</span>
                  <p className="text-gray-800">{projectResponse.projectData?.projectName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Metal Type:</span>
                  <p className="text-gray-800">{projectResponse.projectData?.metalType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">System Boundary:</span>
                  <p className="text-gray-800">{projectResponse.projectData?.systemBoundary}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Functional Unit:</span>
                  <p className="text-gray-800">{projectResponse.projectData?.functionalUnit}</p>
                </div>
              </div>
              
              {projectResponse.projectData?.goal && (
                <div className="mt-4">
                  <span className="font-medium text-gray-600">Goal:</span>
                  <p className="text-gray-800 text-sm mt-1">{projectResponse.projectData.goal}</p>
                </div>
              )}
            </div>

            {projectResponse.inventoryStructure && (
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Inventory Structure Created</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {Object.entries(projectResponse.inventoryStructure).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                      </span>
                      <span className="text-gray-800 font-mono text-xs">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleConfirmAndProceed}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md font-medium transition-colors"
              >
                Continue to Inventory Input
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}