import  { useState } from 'react';
import axios from 'axios';

interface EndOfLifeProps {
  projectId?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function EndOfLife({ projectId, onSuccess, onError }: EndOfLifeProps) {
  // State variables for end-of-life form
  const [recyclingRate, setRecyclingRate] = useState("");
  const [disposalMethod, setDisposalMethod] = useState("");
  const [energyUsed, setEnergyUsed] = useState("");
  
  // Loading and response states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [endOfLifeResponse, setEndOfLifeResponse] = useState<any>(null);
  const [showEndOfLifeModal, setShowEndOfLifeModal] = useState(false);

  const submitEndOfLifeData = async () => {
    // Validation for required fields
    if (!recyclingRate || !disposalMethod) {
      const errorMsg = "Please fill in all required fields: Recycling Rate and Disposal Method";
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    // Validate recycling rate range
    const rate = Number(recyclingRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      const errorMsg = "Recycling rate must be a number between 0 and 100";
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    // Get project ID or use fallback
    const currentProjectId = projectId || "68c30b5357406494ce63b8f9";

    setIsLoading(true);
    setError("");

    try {
      const endOfLifePayload = {
        recyclingRate: Number(recyclingRate),
        disposalMethod,
        Energy_used_kWh_perTon: energyUsed ? Number(energyUsed) : undefined,
      };

      const response = await axios.post(
        `http://localhost:5000/api/inventory/endoflife/${currentProjectId}`,
        endOfLifePayload
      );

      console.log("End of life data submitted successfully:", response.data);
      setEndOfLifeResponse(response.data);
      setShowEndOfLifeModal(true);
      
      // Clear form after successful submission
      resetForm();
      
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error("Error submitting end of life data:", error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Failed to submit end of life data";
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setRecyclingRate("");
    setDisposalMethod("");
    setEnergyUsed("");
    setError("");
  };

  const handleModalClose = () => {
    setShowEndOfLifeModal(false);
    setEndOfLifeResponse(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">End of Life</h1>
          <p className="text-gray-600">Enter the details for product end-of-life management</p>
        </div>

        <div className="space-y-5">
          {/* Error Messages */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <div className="flex">
                <div className="py-1">
                  <svg className="fill-current h-4 w-4 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recycling Rate (%) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="e.g., 75"
                value={recyclingRate}
                onChange={(e) => setRecyclingRate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Percentage of material that gets recycled</p>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disposal Method *
              </label>
              <select
                value={disposalMethod}
                onChange={(e) => setDisposalMethod(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" disabled>Select Disposal Method</option>
                <option value="Recycling">Recycling</option>
                <option value="Landfill">Landfill</option>
                <option value="Incineration">Incineration</option>
                <option value="Reuse">Reuse</option>
                <option value="Composting">Composting</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Energy Used (kWh/ton)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g., 100"
                value={energyUsed}
                onChange={(e) => setEnergyUsed(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Energy consumption for end-of-life processing</p>
            </div>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Recycling Benefits</h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Reduces raw material extraction</li>
                <li>• Lower energy consumption</li>
                <li>• Minimizes landfill waste</li>
                <li>• Reduces greenhouse gas emissions</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-green-900 mb-2">🌱 Environmental Impact</h3>
              <ul className="text-xs text-green-800 space-y-1">
                <li>• Higher recycling rate = lower impact</li>
                <li>• Proper disposal prevents pollution</li>
                <li>• Circular economy principles</li>
                <li>• Resource conservation</li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              onClick={submitEndOfLifeData}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <span>Submit End of Life Data</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            <span className="text-red-500">*</span> Required fields
          </div>
        </div>
      </div>

      {/* End of Life Success Modal */}
      {showEndOfLifeModal && endOfLifeResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-4">
              <div className="text-green-500 text-6xl mb-2">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">End of Life Data Submitted Successfully!</h2>
              <p className="text-gray-600">Your end-of-life management data has been recorded.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">End of Life Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Process ID:</span>
                  <p className="text-gray-900 font-mono">{endOfLifeResponse.endOfLifeData?._id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Recycling Rate:</span>
                  <p className="text-gray-900">{endOfLifeResponse.endOfLifeData?.recyclingRate}%</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Disposal Method:</span>
                  <p className="text-gray-900">{endOfLifeResponse.endOfLifeData?.disposalMethod}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Energy Used:</span>
                  <p className="text-gray-900">
                    {endOfLifeResponse.endOfLifeData?.Energy_used_kWh_perTon || 'N/A'} 
                    {endOfLifeResponse.endOfLifeData?.Energy_used_kWh_perTon && ' kWh/ton'}
                  </p>
                </div>
              </div>
            </div>



            <div className="text-center">
              <button
                onClick={handleModalClose}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Continue to Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}