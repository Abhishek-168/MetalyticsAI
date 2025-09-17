import  { useState } from 'react';
import axios from 'axios';

interface ExtractionProps {
  projectId?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function Extraction({ projectId, onSuccess, onError }: ExtractionProps) {
  // State variables for extraction form
  const [extractionMetal, setExtractionMetal] = useState("");
  const [materialGrade, setMaterialGrade] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [region, setRegion] = useState("");
  const [method, setMethod] = useState("");
  const [energySource, setEnergySource] = useState("");
  const [totalEnergyConsumption, setTotalEnergyConsumption] = useState("");
  const [waterUsage, setWaterUsage] = useState("");
  const [wasteGenerated, setWasteGenerated] = useState("");
  const [costOfExtraction, setCostOfExtraction] = useState("");
  
  // Loading and response states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [extractionResponse, setExtractionResponse] = useState<any>(null);
  const [showExtractionModal, setShowExtractionModal] = useState(false);

  const submitExtractionData = async () => {
    // Validation for required fields
    if (!extractionMetal || !sourceType || !region) {
      const errorMsg = "Please fill in all required fields: Metal, Source Type, and Region";
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    // Get project ID or use fallback
    const currentProjectId = projectId || "68c30b5357406494ce63b8f9";

    setIsLoading(true);
    setError("");

    try {
      const extractionPayload = {
        metal: extractionMetal,
        materialGrade: materialGrade || undefined,
        sourceType,
        region,
        method: method || undefined,
        energySource: energySource ? [{ type: energySource, percent: 100 }] : undefined,
        totalEnergyConsumption_kWh_perTon: totalEnergyConsumption ? Number(totalEnergyConsumption) : undefined,
        waterUsage_L_perTon: waterUsage ? Number(waterUsage) : undefined,
        wasteGenerated_kg_perTon: wasteGenerated ? Number(wasteGenerated) : undefined,
        costOfExtraction_USD_perTon: costOfExtraction ? Number(costOfExtraction) : undefined,
      };

      const response = await axios.post(
        `https://metalyticsai-2.onrender.com//api/inventory/extraction/${currentProjectId}`,
        extractionPayload
      );

      console.log("Extraction data submitted successfully:", response.data);
      setExtractionResponse(response.data);
      setShowExtractionModal(true);
      
      // Clear form after successful submission
      resetForm();
      
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error("Error submitting extraction data:", error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Failed to submit extraction data";
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setExtractionMetal("");
    setMaterialGrade("");
    setSourceType("");
    setRegion("");
    setMethod("");
    setEnergySource("");
    setTotalEnergyConsumption("");
    setWaterUsage("");
    setWasteGenerated("");
    setCostOfExtraction("");
    setError("");
  };

  const handleModalClose = () => {
    setShowExtractionModal(false);
    setExtractionResponse(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Extraction</h1>
          <p className="text-gray-600">Enter the details for raw material extraction process</p>
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
                Metal Type *
              </label>
              <input
                type="text"
                placeholder="e.g., Aluminum, Copper, Steel"
                value={extractionMetal}
                onChange={(e) => setExtractionMetal(e.target.value)}
                className="text-white w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material Grade
              </label>
              <input
                type="text"
                placeholder="e.g., High-grade, Commercial grade"
                value={materialGrade}
                onChange={(e) => setMaterialGrade(e.target.value)}
                className="text-white w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source Type *
              </label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
                className="text-white w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" disabled>Select Source Type</option>
                <option value="mines">Mines</option>
                <option value="quarries">Quarries</option>
                <option value="recycled">Recycled Material</option>
                <option value="secondary">Secondary Sources</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region *
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="text-white w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" disabled>Select Region</option>
                <option value="australia">Australia</option>
                <option value="brazil">Brazil</option>
                <option value="canada">Canada</option>
                <option value="china">China</option>
                <option value="india">India</option>
                <option value="russia">Russia</option>
                <option value="usa">United States</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extraction Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="text-white w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" disabled>Select Extraction Method</option>
                <option value="Open-pit Mining">Open-pit Mining</option>
                <option value="Underground Mining">Underground Mining</option>
                <option value="Strip Mining">Strip Mining</option>
                <option value="Placer Mining">Placer Mining</option>
                <option value="In-situ Leaching">In-situ Leaching</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Energy Source
              </label>
              <select
                value={energySource}
                onChange={(e) => setEnergySource(e.target.value)}
                className="text-white w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" disabled>Select Energy Source</option>
                <option value="Electricity">Electricity</option>
                <option value="Coal">Coal</option>
                <option value="Natural Gas">Natural Gas</option>
                <option value="Diesel">Diesel</option>
                <option value="Renewable">Renewable Energy</option>
                <option value="Mixed">Mixed Sources</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Energy Consumption (kWh/ton)
              </label>
              <input
                type="number"
                placeholder="1200"
                value={totalEnergyConsumption}
                onChange={(e) => setTotalEnergyConsumption(e.target.value)}
                className="text-white w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Water Usage (L/ton)
              </label>
              <input
                type="number"
                placeholder="5000"
                value={waterUsage}
                onChange={(e) => setWaterUsage(e.target.value)}
                className="text-white w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Waste Generated (kg/ton)
              </label>
              <input
                type="number"
                placeholder="300"
                value={wasteGenerated}
                onChange={(e) => setWasteGenerated(e.target.value)}
                className="text-white w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost of Extraction (USD/ton)
              </label>
              <input
                type="number"
                placeholder="50"
                value={costOfExtraction}
                onChange={(e) => setCostOfExtraction(e.target.value)}
                className="text-white w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              onClick={submitExtractionData}
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
                  <span>Submit Extraction Data</span>
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

      {/* Extraction Success Modal */}
      {showExtractionModal && extractionResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-4">
              <div className="text-green-500 text-6xl mb-2">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Extraction Data Submitted Successfully!</h2>
              <p className="text-gray-600">Your extraction process data has been recorded.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Extraction Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Process ID:</span>
                  <p className="text-gray-900 font-mono">{extractionResponse.extractionData?._id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Metal:</span>
                  <p className="text-gray-900">{extractionResponse.extractionData?.metal}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Source Type:</span>
                  <p className="text-gray-900">{extractionResponse.extractionData?.sourceType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Region:</span>
                  <p className="text-gray-900">{extractionResponse.extractionData?.region}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Method:</span>
                  <p className="text-gray-900">{extractionResponse.extractionData?.method || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Material Grade:</span>
                  <p className="text-gray-900">{extractionResponse.extractionData?.materialGrade || 'N/A'}</p>
                </div>
              </div>
            </div>

            {extractionResponse.extractionData && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Resource Consumption</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {extractionResponse.extractionData.energySource && extractionResponse.extractionData.energySource.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Energy Source:</span>
                      <div className="text-gray-900">
                        {extractionResponse.extractionData.energySource.map((energy: any, index: number) => (
                          <p key={index}>{energy.type}: {energy.percent}%</p>
                        ))}
                      </div>
                    </div>
                  )}
                  {extractionResponse.extractionData.totalEnergyConsumption_kWh_perTon && (
                    <div>
                      <span className="font-medium text-gray-700">Energy Consumption:</span>
                      <p className="text-gray-900">{extractionResponse.extractionData.totalEnergyConsumption_kWh_perTon} kWh/ton</p>
                    </div>
                  )}
                  {extractionResponse.extractionData.waterUsage_L_perTon && (
                    <div>
                      <span className="font-medium text-gray-700">Water Usage:</span>
                      <p className="text-gray-900">{extractionResponse.extractionData.waterUsage_L_perTon} L/ton</p>
                    </div>
                  )}
                  {extractionResponse.extractionData.wasteGenerated_kg_perTon && (
                    <div>
                      <span className="font-medium text-gray-700">Waste Generated:</span>
                      <p className="text-gray-900">{extractionResponse.extractionData.wasteGenerated_kg_perTon} kg/ton</p>
                    </div>
                  )}
                  {extractionResponse.extractionData.costOfExtraction_USD_perTon && (
                    <div>
                      <span className="font-medium text-gray-700">Extraction Cost:</span>
                      <p className="text-gray-900">${extractionResponse.extractionData.costOfExtraction_USD_perTon}/ton</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={handleModalClose}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Continue to Next Stage
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}