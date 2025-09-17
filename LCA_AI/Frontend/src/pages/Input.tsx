import  { Suspense } from 'react';
import { useParams } from "react-router-dom";
import { Project_meta } from "../Components/atoms/project";
import { useRecoilValue } from "recoil";
import Navbar from "../Components/Navbar";

// Import your inventory components
import Extraction from "../Components/Inventory/extraction";
import Refining from "../Components/Inventory/refining";
import Smelting from "../Components/Inventory/smelting";
import Casting from "../Components/Inventory/casting";
import Recycling from "../Components/Inventory/recycle";
import Transportation from '../Components/Inventory/transport';
import EndOfLife from '../Components/Inventory/endlife';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h1 className="text-2xl font-bold text-gray-600 mb-4">Loading...</h1>
      <p>Loading project data...</p>
    </div>
  </div>
);

// Error boundary component
const ErrorFallback = ({ projectId }: { error: any, projectId: string }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Project</h1>
      <p className="text-red-800 mb-4">
        Failed to load project data for ID: {projectId}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        Please check if the project exists and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  </div>
);

// Main project content component
const ProjectContent = ({ projectId, stage }: { projectId: string, stage?: string }) => {
  const projectMeta = useRecoilValue(Project_meta(projectId));

  if (!projectMeta) {
    return <ErrorFallback error={null} projectId={projectId} />;
  }

  const renderStageComponent = () => {
    switch (stage) {
      case 'extraction':
        return <Extraction projectId={projectId} />;
      case 'transport-refinery':
        return <Transportation projectId={projectId} />;
      case 'refining':
        return <Refining projectId={projectId} />;
      case 'smelting':
        return <Smelting projectId={projectId} />;
      case 'casting':
        return <Casting projectId={projectId} />;
      case 'transport-consumer':
         return <Transportation projectId={projectId} />;

      case 'usage':
        return <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold mb-4">Usage Phase</h2>
          <p className="text-gray-600">This component is coming soon...</p>
        </div>;
      case 'recycling':
        return <Recycling projectId={projectId} />;
      case 'end-of-life':
        return <EndOfLife projectId={projectId} />;
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Welcome to LCA Input</h1>
            <p className="text-gray-600 mb-6 text-lg">
              Select an inventory stage from the left sidebar to begin data input.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <h2 className="font-semibold text-blue-900 mb-4 text-xl">Project Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-blue-700">Project Name:</span>
                  <p className="text-blue-900 font-semibold">{projectMeta.project_name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-blue-700">Metal Type:</span>
                  <p className="text-blue-900 font-semibold">{projectMeta.metal_type}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-blue-700">Goal:</span>
                  <p className="text-blue-900">{projectMeta.goal}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-blue-700">Functional Unit:</span>
                  <p className="text-blue-900">{projectMeta.functional_unit}</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
<div className="ml-72"> {/* Changed from ml-80 to ml-72 */}
  <main className="p-6 max-w-4xl mx-auto"> {/* Added mx-auto for centering and reduced max-width */}
    <div className="w-full">
      {renderStageComponent()}
    </div>
  </main>
</div>
    </div>
  );
};

export default function Input() {
  const { id, stage } = useParams();
  
  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p>Project ID is missing in the URL.</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProjectContent projectId={id} stage={stage} />
    </Suspense>
  );
}


