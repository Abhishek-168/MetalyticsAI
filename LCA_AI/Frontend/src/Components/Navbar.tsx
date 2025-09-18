import  { Suspense } from 'react';
import { useRecoilValue } from 'recoil';
import { useParams, useNavigate } from 'react-router-dom';
import { Project_meta } from './atoms/project';

// Navbar content component
const NavbarContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  
  if (!id) {
    return (
      <nav className="bg-[#f8fff0] text-black p-4 border-b border-red-700 w-full pl-[3em] pr-[3em]">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Metalytics AI</h1>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Home
          </button>
        </div>
      </nav>
    );
  }

  const metadata = useRecoilValue(Project_meta(id));
  console.log("Project Metadata:", metadata);

  if (!metadata || metadata.project_name === "Unknown Project") {
    return (
      <nav className="bg-[#f8f0f0] text-black p-4 border-b border-red-700 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Metalytics AI - Project Error</h1>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Home
          </button>
        </div>
      </nav>
    );
  }

  const getStageColor = (status: number) => {
    switch (status) {
      case 0: return 'hidden';
      case 1: return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 2: return 'bg-green-100 border-green-400 text-green-800';
      default: return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  const getStageIcon = (status: number) => {
    switch (status) {
      case 1: return '⏳';
      case 2: return '✅';
      default: return '❓';
    }
  };

  const inventoryStages = [
    { key: 'extraction', label: 'Extraction', route: 'extraction' },
    { key: 'Tport_to_refinary', label: 'Transport to Refinery', route: 'transport-refinery' },
    { key: 'refining', label: 'Refining', route: 'refining' },
    { key: 'smelting', label: 'Smelting', route: 'smelting' },
    { key: 'Casting', label: 'Casting', route: 'casting' },
    { key: 'Tport_to_consumer', label: 'Transport to Consumer', route: 'transport-consumer' },
    { key: 'usage_phase', label: 'Usage Phase', route: 'usage' },
    { key: 'Recycle', label: 'Recycling', route: 'recycling' },
    { key: 'end_of_life', label: 'End of Life', route: 'end-of-life' }
  ];

  return (
    <div className="flex">
      {/* Left Sidebar - Fixed positioning with proper scrolling */}
      <div className="w-72 bg-gray-50 border-r border-gray-200 fixed top-0 left-0 h-screen overflow-y-auto z-10">
        <div className="p-4 space-y-6">
          {/* Project Details Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              📋 Project Details
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-2">
              <div>
                <span className="text-xs font-medium text-gray-600">Project:</span>
                <p className="text-sm text-gray-900 font-medium truncate">{metadata.project_name}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600">Metal:</span>
                <p className="text-sm text-gray-900">{metadata.metal_type}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600">Goal:</span>
                <p className="text-xs text-gray-900 line-clamp-2">{metadata.goal}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600">Boundary:</span>
                <p className="text-xs text-gray-900">{metadata.system_boundary}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600">Unit:</span>
                <p className="text-xs text-gray-900">{metadata.functional_unit}</p>
              </div>
            </div>
          </div>

          {/* Inventory Stages Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              🏭 Inventory Stages
            </h2>
            <div className="space-y-2">
              {inventoryStages.map((stage) => {
                const status = metadata.inventory[stage.key];

                const colorClass = getStageColor(status);
                
                if (status === 0) {
                  return null;
                }

                return (
               
                  <button
                    key={stage.key}
                    onClick={() => navigate(`/input/${id}/${stage.route}`)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${colorClass} ${
                      status === 1 ? 'hover:bg-yellow-200' : 'hover:bg-green-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getStageIcon(status)}</span>
                        <div>
                          <p className="font-medium text-sm">{stage.label}</p>
                          <p className="text-xs opacity-75">
                            {status === 1 ? 'Pending' : 'Completed'}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs opacity-60">→</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Results Section */}
            {metadata.results !== 0 && (
              <div className="mt-4">
                <button
                  onClick={() => navigate(`/results/674a1b2c3d4e5f6789012345`)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    getStageColor(metadata.results)
                  } ${metadata.results === 1 ? 'hover:bg-yellow-200' : 'hover:bg-green-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getStageIcon(metadata.results)}</span>
                      <div>
                        <p className="font-medium text-sm">📊 Results & Analysis</p>
                        <p className="text-xs opacity-75">
                          {metadata.results === 1 ? 'Generate Report' : 'View Report'}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs opacity-60">→</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Progress Overview</h3>
            <div className="space-y-2">
              {(() => {
                const applicableStages = inventoryStages.filter(stage => metadata.inventory[stage.key] !== 0);
                const completedStages = applicableStages.filter(stage => metadata.inventory[stage.key] === 2);
                const progressPercentage = applicableStages.length > 0 
                  ? Math.round((completedStages.length / applicableStages.length) * 100) 
                  : 0;

                return (
                  <>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Completed: {completedStages.length}/{applicableStages.length}</span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Add some bottom padding to ensure last item is visible when scrolled */}
          <div className="h-4"></div>
        </div>
      </div>

      {/* Top Navbar */}
      <div className="flex-1 ml-72">
        <nav className="bg-[#f8f0f0] text-black p-4 border-b border-red-700 w-full fixed top-0 right-0 z-20" style={{ width: 'calc(100% - 288px)' }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">Metalytics AI - {metadata.project_name}</h1>
              <span className="text-sm text-gray-600">ID: {id}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                Home
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default function Navbar() {
  return (
    <Suspense fallback={
      <div className="bg-gray-100 p-4">
        <div className="animate-pulse">Loading navigation...</div>
      </div>
    }>
      <NavbarContent />
    </Suspense>
  );
}
