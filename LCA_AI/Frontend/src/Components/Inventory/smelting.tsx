import { useState } from 'react';
import axios from 'axios';

interface SmeltingProps {
  projectId?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function Smelting({ projectId, onSuccess, onError }: SmeltingProps) {
  // State variables for smelting form
  const [smeltingTech, setSmeltingTech] = useState("");
  const [materialInput_tons_perBatch, setMaterialInput_tons_perBatch] = useState("");
  const [operatingTemp_C, setOperatingTemp_C] = useState("");
  const [energyConsumption_kWh_perTon, setEnergyConsumption_kWh_perTon] = useState("");
  const [energySource, setEnergySource] = useState("");
  const [fluxMaterials_kg_perTon, setFluxMaterials_kg_perTon] = useState("");
  const [slagGenerated_kg_perTon, setSlagGenerated_kg_perTon] = useState("");
  const [outputEfficiency_percent, setOutputEfficiency_percent] = useState("");
  const [recycledScrapInput_tons_perTon, setRecycledScrapInput_tons_perTon] = useState("");
  const [recyclingQuality, setRecyclingQuality] = useState("");
  const [waterConsumption_L_perTon, setWaterConsumption_L_perTon] = useState("");
  const [operatingCost_USD_perTon, setOperatingCost_USD_perTon] = useState("");

  // Loading and response states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [smeltingResponse, setSmeltingResponse] = useState<any>(null);
  const [showSmeltingModal, setShowSmeltingModal] = useState(false);

  const submitSmeltingData = async () => {
    // Validation for required fields
    if (!smeltingTech || !materialInput_tons_perBatch || !operatingTemp_C) {
      const errorMsg = "Please fill in all required fields: Smelting Technology, Material Input, and Operating Temperature";
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    const currentProjectId = projectId || "68c30b5357406494ce63b8f9";
    setIsLoading(true);
    setError("");

    try {
      const smeltingPayload = {
        smeltingTech,
        materialInput_tons_perBatch: Number(materialInput_tons_perBatch),
        operatingTemp_C: Number(operatingTemp_C),
        energyConsumption_kWh_perTon: energyConsumption_kWh_perTon ? Number(energyConsumption_kWh_perTon) : undefined,
        energySource: energySource || undefined,
        fluxMaterials_kg_perTon: fluxMaterials_kg_perTon ? Number(fluxMaterials_kg_perTon) : undefined,
        slagGenerated_kg_perTon: slagGenerated_kg_perTon ? Number(slagGenerated_kg_perTon) : undefined,
        outputEfficiency_percent: outputEfficiency_percent ? Number(outputEfficiency_percent) : undefined,
        recycledScrapInput_tons_perTon: recycledScrapInput_tons_perTon ? Number(recycledScrapInput_tons_perTon) : undefined,
        recyclingQuality: recyclingQuality || undefined,
        waterConsumption_L_perTon: waterConsumption_L_perTon ? Number(waterConsumption_L_perTon) : undefined,
        operatingCost_USD_perTon: operatingCost_USD_perTon ? Number(operatingCost_USD_perTon) : undefined,
      };

      const response = await axios.post(
        `https://metalyticsai-2.onrender.com//api/inventory/smelting/${currentProjectId}`,
        smeltingPayload
      );

      console.log("Smelting data submitted successfully:", response.data);
      setSmeltingResponse(response.data);
      setShowSmeltingModal(true);
      
      // Clear form after successful submission
      resetForm();
      
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error("Error submitting smelting data:", error);
      const errorMsg = error.response?.data?.message || "Failed to submit smelting data";
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSmeltingTech("");
    setMaterialInput_tons_perBatch("");
    setOperatingTemp_C("");
    setEnergyConsumption_kWh_perTon("");
    setEnergySource("");
    setFluxMaterials_kg_perTon("");
    setSlagGenerated_kg_perTon("");
    setOutputEfficiency_percent("");
    setRecycledScrapInput_tons_perTon("");
    setRecyclingQuality("");
    setWaterConsumption_L_perTon("");
    setOperatingCost_USD_perTon("");
    setError("");
  };

  const handleModalClose = () => {
    setShowSmeltingModal(false);
    setSmeltingResponse(null);
  };

  return (
    <>
      <div className="flex flex-col space-y-5 text-black">
        <span className="text-2xl font-semibold">Smelting</span>
        
        {/* Error Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="relative">
          <select
            value={smeltingTech}
            onChange={(e) => setSmeltingTech(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
          >
            <option value="" disabled>Select Smelting Technology *</option>
            <option value="blast_furnace">Blast Furnace</option>
            <option value="electric_arc_furnace">Electric Arc Furnace</option>
            <option value="induction_furnace">Induction Furnace</option>
            <option value="reverberatory_furnace">Reverberatory Furnace</option>
            <option value="flash_smelting">Flash Smelting</option>
            <option value="top_submerged_lance">Top Submerged Lance (TSL)</option>
            <option value="imperial_smelting">Imperial Smelting</option>
            <option value="direct_smelting">Direct Smelting</option>
          </select>
          <span className="text-red-500 text-lg absolute -top-1 -right-2">*</span>
        </div>

        <div className="relative">
          <input
            type="number"
            placeholder="Material Input (tons per batch)"
            value={materialInput_tons_perBatch}
            onChange={(e) => setMaterialInput_tons_perBatch(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
          />
          <span className="text-red-500 text-lg absolute -top-1 -right-2">*</span>
        </div>

        <div className="relative">
          <input
            type="number"
            placeholder="Operating Temperature (°C)"
            value={operatingTemp_C}
            onChange={(e) => setOperatingTemp_C(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
          />
          <span className="text-red-500 text-lg absolute -top-1 -right-2">*</span>
        </div>

        <input
          type="number"
          placeholder="Energy Consumption (kWh per ton)"
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
          <option value="coal">Coal</option>
          <option value="coke">Coke</option>
          <option value="natural_gas">Natural Gas</option>
          <option value="oil">Oil</option>
          <option value="renewable">Renewable Energy</option>
          <option value="mixed">Mixed Sources</option>
        </select>

        <input
          type="number"
          placeholder="Flux Materials (kg per ton)"
          value={fluxMaterials_kg_perTon}
          onChange={(e) => setFluxMaterials_kg_perTon(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Slag Generated (kg per ton)"
          value={slagGenerated_kg_perTon}
          onChange={(e) => setSlagGenerated_kg_perTon(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Output Efficiency (percent)"
          value={outputEfficiency_percent}
          onChange={(e) => setOutputEfficiency_percent(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Recycled Scrap Input (tons per ton)"
          value={recycledScrapInput_tons_perTon}
          onChange={(e) => setRecycledScrapInput_tons_perTon(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <select
          value={recyclingQuality}
          onChange={(e) => setRecyclingQuality(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        >
          <option value="" disabled>Select Recycling Quality</option>
          <option value="high">High Quality</option>
          <option value="medium">Medium Quality</option>
          <option value="low">Low Quality</option>
          <option value="industrial_grade">Industrial Grade</option>
          <option value="commercial_grade">Commercial Grade</option>
        </select>

        <input
          type="number"
          placeholder="Water Consumption (litre per ton)"
          value={waterConsumption_L_perTon}
          onChange={(e) => setWaterConsumption_L_perTon(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Operating Cost (USD per ton)"
          value={operatingCost_USD_perTon}
          onChange={(e) => setOperatingCost_USD_perTon(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        {/* Submit Smelting Data Button */}
        <button
          onClick={submitSmeltingData}
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors w-[400px]"
        >
          {isLoading ? "Submitting..." : "Submit Smelting Data"}
        </button>
        
        <div className="text-xs text-gray-500 mt-2">
          <span className="text-red-500">*</span> Required fields
        </div>
      </div>

      {/* Smelting Success Modal */}
      {showSmeltingModal && smeltingResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-4">
              <div className="text-green-500 text-6xl mb-2">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Smelting Data Submitted Successfully!</h2>
              <p className="text-gray-600">Your smelting process data has been recorded.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Smelting Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Process ID:</span>
                  <p className="text-gray-900 font-mono">{smeltingResponse.smeltingData?._id || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Smelting Technology:</span>
                  <p className="text-gray-900">{smeltingResponse.smeltingData?.smeltingTech || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Material Input:</span>
                  <p className="text-gray-900">{smeltingResponse.smeltingData?.materialInput_tons_perBatch || 'N/A'} tons/batch</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Operating Temperature:</span>
                  <p className="text-gray-900">{smeltingResponse.smeltingData?.operatingTemp_C || 'N/A'}°C</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Energy Source:</span>
                  <div className="text-gray-900">
                    {smeltingResponse.smeltingData?.energySource && Array.isArray(smeltingResponse.smeltingData.energySource) 
                      ? smeltingResponse.smeltingData.energySource.map((energy: any, index: number) => (
                          <p key={index}>{energy.type}: {energy.percent}%</p>
                        ))
                      : 'N/A'
                    }
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Recycling Quality:</span>
                  <p className="text-gray-900">{smeltingResponse.smeltingData?.recyclingQuality || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleModalClose}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
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