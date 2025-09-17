import  { useState } from 'react';
import axios from 'axios';

interface RefiningProps {
  projectId?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function Refining({ projectId, onSuccess, onError }: RefiningProps) {
  // State variables for refining form
  const [refiningType, setRefiningType] = useState("");
  const [materialInput_tons, setMaterialInput_tons] = useState("");
  const [outputEfficiency_percent, setOutputEfficiency_percent] = useState("");
  const [energyConsumption_kWh_perTon, setEnergyConsumption_kWh_perTon] = useState("");
  const [energySource, setEnergySource] = useState("");
  const [waterConsumption_L_perTon, setWaterConsumption_L_perTon] = useState("");
  const [chemicalsUsed_kg_perTon, setChemicalsUsed_kg_perTon] = useState("");
  const [wasteSlagGenerated_kg_perTon, setWasteSlagGenerated_kg_perTon] = useState("");
  const [materialLostAsImpurity_percent, setMaterialLostAsImpurity_percent] = useState("");
  const [recyclingContent_percent, setRecyclingContent_percent] = useState("");
  const [recyclingOutputQuality, setRecyclingOutputQuality] = useState("");
  const [operatingCost_USD_perTon, setOperatingCost_USD_perTon] = useState("");

  // Loading and response states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [refiningResponse, setRefiningResponse] = useState<any>(null);
  const [showRefiningModal, setShowRefiningModal] = useState(false);

  const formatEnergySourceForSubmission = (energySource: string) => {
    if (!energySource) return undefined;
    
    // Convert single energy source to array format expected by backend
    return [{ type: energySource, percent: 100 }];
  };

  const submitRefiningData = async () => {
    // Validation for required fields
    if (!refiningType || !materialInput_tons || !outputEfficiency_percent) {
      const errorMsg = "Please fill in all required fields: Refining Type, Material Input, and Output Efficiency";
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    const currentProjectId = projectId || "68c30b5357406494ce63b8f9";
    setIsLoading(true);
    setError("");

    try {
      const refiningPayload = {
        refiningType,
        materialInput_tons: Number(materialInput_tons),
        outputEfficiency_percent: Number(outputEfficiency_percent),
        energyConsumption_kWh_perTon: energyConsumption_kWh_perTon ? Number(energyConsumption_kWh_perTon) : undefined,
        energySource: formatEnergySourceForSubmission(energySource),
        waterConsumption_L_perTon: waterConsumption_L_perTon ? Number(waterConsumption_L_perTon) : undefined,
        chemicalsUsed_kg_perTon: chemicalsUsed_kg_perTon ? Number(chemicalsUsed_kg_perTon) : undefined,
        wasteSlagGenerated_kg_perTon: wasteSlagGenerated_kg_perTon ? Number(wasteSlagGenerated_kg_perTon) : undefined,
        materialLostAsImpurity_percent: materialLostAsImpurity_percent ? Number(materialLostAsImpurity_percent) : undefined,
        recyclingContent_percent: recyclingContent_percent ? Number(recyclingContent_percent) : undefined,
        recyclingOutputQuality: recyclingOutputQuality || undefined,
        operatingCost_USD_perTon: operatingCost_USD_perTon ? Number(operatingCost_USD_perTon) : undefined,
      };

      const response = await axios.post(
        `https://metalyticsai-2.onrender.com//api/inventory/refining/${currentProjectId}`,
        refiningPayload
      );

      console.log("Refining data submitted successfully:", response.data);
      setRefiningResponse(response.data);
      setShowRefiningModal(true);
      
      // Clear form after successful submission
      resetForm();
      
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error("Error submitting refining data:", error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Failed to submit refining data";
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setRefiningType("");
    setMaterialInput_tons("");
    setOutputEfficiency_percent("");
    setEnergyConsumption_kWh_perTon("");
    setEnergySource("");
    setWaterConsumption_L_perTon("");
    setChemicalsUsed_kg_perTon("");
    setWasteSlagGenerated_kg_perTon("");
    setMaterialLostAsImpurity_percent("");
    setRecyclingContent_percent("");
    setRecyclingOutputQuality("");
    setOperatingCost_USD_perTon("");
    setError("");
  };

  const handleModalClose = () => {
    setShowRefiningModal(false);
    setRefiningResponse(null);
  };

  return (
    <>
      <div className="flex flex-col space-y-5 text-black">
        <span className="text-2xl font-semibold">Refining</span>
        
        {/* Error Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="relative">
          <select
            value={refiningType}
            onChange={(e) => setRefiningType(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
          >
            <option value="" disabled>Select Refining Type *</option>
            <option value="pyrometallurgy">Pyrometallurgy</option>
            <option value="hydrometallurgy">Hydrometallurgy</option>
            <option value="electrometallurgy">Electrometallurgy</option>
            <option value="smelting">Smelting</option>
            <option value="leaching">Leaching</option>
            <option value="flotation">Flotation</option>
            <option value="calcination">Calcination</option>
            <option value="roasting">Roasting</option>
          </select>
          <span className="text-red-500 text-lg absolute -top-1 -right-2">*</span>
        </div>

        <div className="relative">
          <input
            type="number"
            placeholder="Material Input (tons)"
            value={materialInput_tons}
            onChange={(e) => setMaterialInput_tons(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
          />
          <span className="text-red-500 text-lg absolute -top-1 -right-2">*</span>
        </div>

        <div className="relative">
          <input
            type="number"
            placeholder="Output Efficiency (percent)"
            value={outputEfficiency_percent}
            onChange={(e) => setOutputEfficiency_percent(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
          />
          <span className="text-red-500 text-lg absolute -top-1 -right-2">*</span>
        </div>

        <input
          type="number"
          placeholder="Energy Consumption (kWh/ton)"
          value={energyConsumption_kWh_perTon}
          onChange={(e) => setEnergyConsumption_kWh_perTon(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <select
          value={energySource}
          onChange={(e) => setEnergySource(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        >
          <option value="" disabled>Select Energy Source</option>
          <option value="electricity">Electricity</option>
          <option value="natural_gas">Natural Gas</option>
          <option value="coal">Coal</option>
          <option value="oil">Oil</option>
          <option value="renewable">Renewable Energy</option>
          <option value="mixed">Mixed Sources</option>
        </select>

        <input
          type="number"
          placeholder="Water Consumption (litre/ton)"
          value={waterConsumption_L_perTon}
          onChange={(e) => setWaterConsumption_L_perTon(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Chemical Used (kg/ton)"
          value={chemicalsUsed_kg_perTon}
          onChange={(e) => setChemicalsUsed_kg_perTon(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Waste Slag Generated (kg/ton)"
          value={wasteSlagGenerated_kg_perTon}
          onChange={(e) => setWasteSlagGenerated_kg_perTon(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Material Lost as Impurity (percent)"
          value={materialLostAsImpurity_percent}
          onChange={(e) => setMaterialLostAsImpurity_percent(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Recycling Content (percent)"
          value={recyclingContent_percent}
          onChange={(e) => setRecyclingContent_percent(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <select
          value={recyclingOutputQuality}
          onChange={(e) => setRecyclingOutputQuality(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        >
          <option value="" disabled>Select Recycling Output Quality</option>
          <option value="high">High Quality</option>
          <option value="medium">Medium Quality</option>
          <option value="low">Low Quality</option>
          <option value="industrial_grade">Industrial Grade</option>
          <option value="commercial_grade">Commercial Grade</option>
        </select>

        <input
          type="number"
          placeholder="Operating Cost (USD/ton)"
          value={operatingCost_USD_perTon}
          onChange={(e) => setOperatingCost_USD_perTon(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        {/* Submit Refining Data Button */}
        <button
          onClick={submitRefiningData}
          disabled={isLoading}
          className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors w-[400px]"
        >
          {isLoading ? "Submitting..." : "Submit Refining Data"}
        </button>
        
        <div className="text-xs text-gray-500 mt-2">
          <span className="text-red-500">*</span> Required fields
        </div>
      </div>

      {/* Refining Success Modal */}
      {showRefiningModal && refiningResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-4">
              <div className="text-green-500 text-6xl mb-2">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Refining Data Submitted Successfully!</h2>
              <p className="text-gray-600">Your refining process data has been recorded.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Refining Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Process ID:</span>
                  <p className="text-gray-900 font-mono">{refiningResponse.refiningData?._id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Refining Type:</span>
                  <p className="text-gray-900">{refiningResponse.refiningData?.refiningType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Material Input:</span>
                  <p className="text-gray-900">{refiningResponse.refiningData?.materialInput_tons} tons</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Output Efficiency:</span>
                  <p className="text-gray-900">{refiningResponse.refiningData?.outputEfficiency_percent}%</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Energy Source:</span>
                  <div className="text-gray-900">
                    {refiningResponse.refiningData?.energySource && Array.isArray(refiningResponse.refiningData.energySource) 
                      ? refiningResponse.refiningData.energySource.map((energy: any, index: number) => (
                          <p key={index}>{energy.type}: {energy.percent}%</p>
                        ))
                      : refiningResponse.refiningData?.energySource || 'N/A'
                    }
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Recycling Quality:</span>
                  <p className="text-gray-900">{refiningResponse.refiningData?.recyclingOutputQuality || 'N/A'}</p>
                </div>
              </div>
            </div>

            {refiningResponse.refiningData && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Resource Consumption</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {refiningResponse.refiningData.energyConsumption_kWh_perTon && (
                    <div>
                      <span className="font-medium text-gray-700">Energy Consumption:</span>
                      <p className="text-gray-900">{refiningResponse.refiningData.energyConsumption_kWh_perTon} kWh/ton</p>
                    </div>
                  )}
                  {refiningResponse.refiningData.waterConsumption_L_perTon && (
                    <div>
                      <span className="font-medium text-gray-700">Water Consumption:</span>
                      <p className="text-gray-900">{refiningResponse.refiningData.waterConsumption_L_perTon} L/ton</p>
                    </div>
                  )}
                  {refiningResponse.refiningData.chemicalsUsed_kg_perTon && (
                    <div>
                      <span className="font-medium text-gray-700">Chemicals Used:</span>
                      <div className="text-gray-900">
                        {Array.isArray(refiningResponse.refiningData.chemicalsUsed_kg_perTon) 
                          ? refiningResponse.refiningData.chemicalsUsed_kg_perTon.map((chemical: any, index: number) => (
                              <p key={index}>{chemical.name}: {chemical.amount_kg} kg</p>
                            ))
                          : `${refiningResponse.refiningData.chemicalsUsed_kg_perTon} kg/ton`
                        }
                      </div>
                    </div>
                  )}
                  {refiningResponse.refiningData.wasteSlagGenerated_kg_perTon && (
                    <div>
                      <span className="font-medium text-gray-700">Waste Slag:</span>
                      <p className="text-gray-900">{refiningResponse.refiningData.wasteSlagGenerated_kg_perTon} kg/ton</p>
                    </div>
                  )}
                  {refiningResponse.refiningData.materialLostAsImpurity_percent && (
                    <div>
                      <span className="font-medium text-gray-700">Material Loss:</span>
                      <p className="text-gray-900">{refiningResponse.refiningData.materialLostAsImpurity_percent}%</p>
                    </div>
                  )}
                  {refiningResponse.refiningData.operatingCost_USD_perTon && (
                    <div>
                      <span className="font-medium text-gray-700">Operating Cost:</span>
                      <p className="text-gray-900">${refiningResponse.refiningData.operatingCost_USD_perTon}/ton</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Environmental Impact Summary */}
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Process Efficiency Summary</h3>
              <div className="text-sm">
                {(() => {
                  const efficiency = refiningResponse.refiningData?.outputEfficiency_percent || 0;
                  const materialLoss = refiningResponse.refiningData?.materialLostAsImpurity_percent || 0;

                  if (efficiency >= 90 && materialLoss <= 5) {
                    return (
                      <div className="flex items-center text-green-700">
                        <span className="text-lg mr-2">🌟</span>
                        <span>Excellent refining efficiency with minimal material loss!</span>
                      </div>
                    );
                  } else if (efficiency >= 80 && materialLoss <= 10) {
                    return (
                      <div className="flex items-center text-yellow-700">
                        <span className="text-lg mr-2">⚡</span>
                        <span>Good refining process. Consider optimizing to reduce material loss.</span>
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex items-center text-orange-700">
                        <span className="text-lg mr-2">⚠️</span>
                        <span>Refining process has room for improvement in efficiency and waste reduction.</span>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleModalClose}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
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