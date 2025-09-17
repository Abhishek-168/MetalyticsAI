import { useState } from 'react';
import axios from 'axios';

interface CastingProps {
  projectId?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function Casting({ projectId, onSuccess, onError }: CastingProps) {
  // State variables for casting form
  const [castingProcessType, setCastingProcessType] = useState("");
  const [materialInputQuantity_tons, setMaterialInputQuantity_tons] = useState("");
  const [operatingTemperature_C, setOperatingTemperature_C] = useState("");
  const [energyConsumption_kWh_per_ton, setEnergyConsumption_kWh_per_ton] = useState("");
  const [energySource, setEnergySource] = useState("");
  const [moldMaterial, setMoldMaterial] = useState("");
  const [coolingMethod, setCoolingMethod] = useState("");
  const [waterConsumption_liters_per_ton, setWaterConsumption_liters_per_ton] = useState("");
  const [emissions, setEmissions] = useState("");
  const [defectRate_percent, setDefectRate_percent] = useState("");
  const [scrapRecycled_percent, setScrapRecycled_percent] = useState("");
  const [scrapQualityLevel, setScrapQualityLevel] = useState("");
  const [packagingType, setPackagingType] = useState("");
  const [finalProductYield_percent, setFinalProductYield_percent] = useState("");
  const [materialLoss_percent, setMaterialLoss_percent] = useState("");
  const [wasteGenerated_kg_per_ton, setWasteGenerated_kg_per_ton] = useState("");
  const [operatingCost_per_ton, setOperatingCost_per_ton] = useState("");

  // Loading and response states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [castingResponse, setCastingResponse] = useState<any>(null);
  const [showCastingModal, setShowCastingModal] = useState(false);

  const submitCastingData = async () => {
    // Validation for required fields
    if (!castingProcessType || !materialInputQuantity_tons || !operatingTemperature_C) {
      const errorMsg = "Please fill in all required fields: Casting Process Type, Material Input Quantity, and Operating Temperature";
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    const currentProjectId = projectId || "68c30b5357406494ce63b8f9";
    setIsLoading(true);
    setError("");

    try {
      const castingPayload = {
        castingProcessType,
        materialInputQuantity_tons: Number(materialInputQuantity_tons),
        operatingTemperature_C: Number(operatingTemperature_C),
        energyConsumption_kWh_per_ton: energyConsumption_kWh_per_ton ? Number(energyConsumption_kWh_per_ton) : undefined,
        energySource: energySource || undefined,
        moldMaterial: moldMaterial || undefined,
        coolingMethod: coolingMethod || undefined,
        waterConsumption_liters_per_ton: waterConsumption_liters_per_ton ? Number(waterConsumption_liters_per_ton) : undefined,
        emissions: emissions || undefined,
        defectRate_percent: defectRate_percent ? Number(defectRate_percent) : undefined,
        scrapRecycled_percent: scrapRecycled_percent ? Number(scrapRecycled_percent) : undefined,
        scrapQualityLevel: scrapQualityLevel || undefined,
        packagingType: packagingType || undefined,
        finalProductYield_percent: finalProductYield_percent ? Number(finalProductYield_percent) : undefined,
        materialLoss_percent: materialLoss_percent ? Number(materialLoss_percent) : undefined,
        wasteGenerated_kg_per_ton: wasteGenerated_kg_per_ton ? Number(wasteGenerated_kg_per_ton) : undefined,
        operatingCost_per_ton: operatingCost_per_ton ? Number(operatingCost_per_ton) : undefined,
      };

      const response = await axios.post(
        `http://localhost:5000/api/inventory/casting/${currentProjectId}`,
        castingPayload
      );

      console.log("Casting data submitted successfully:", response.data);
      setCastingResponse(response.data);
      setShowCastingModal(true);
      
      // Clear form after successful submission
      resetForm();
      
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error("Error submitting casting data:", error);
      const errorMsg = error.response?.data?.message || "Failed to submit casting data";
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCastingProcessType("");
    setMaterialInputQuantity_tons("");
    setOperatingTemperature_C("");
    setEnergyConsumption_kWh_per_ton("");
    setEnergySource("");
    setMoldMaterial("");
    setCoolingMethod("");
    setWaterConsumption_liters_per_ton("");
    setEmissions("");
    setDefectRate_percent("");
    setScrapRecycled_percent("");
    setScrapQualityLevel("");
    setPackagingType("");
    setFinalProductYield_percent("");
    setMaterialLoss_percent("");
    setWasteGenerated_kg_per_ton("");
    setOperatingCost_per_ton("");
    setError("");
  };

  const handleModalClose = () => {
    setShowCastingModal(false);
    setCastingResponse(null);
  };

  return (
    <>
      <div className="flex flex-col space-y-5 text-black">
        <span className="text-2xl font-semibold">Casting</span>
        
        {/* Error Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="relative">
          <select
            value={castingProcessType}
            onChange={(e) => setCastingProcessType(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
          >
            <option value="" disabled>Select Casting Process Type *</option>
            <option value="sand_casting">Sand Casting</option>
            <option value="investment_casting">Investment Casting</option>
            <option value="die_casting">Die Casting</option>
            <option value="permanent_mold">Permanent Mold Casting</option>
            <option value="centrifugal_casting">Centrifugal Casting</option>
            <option value="continuous_casting">Continuous Casting</option>
            <option value="shell_molding">Shell Molding</option>
            <option value="pressure_die_casting">Pressure Die Casting</option>
          </select>
          <span className="text-red-500 text-lg absolute -top-1 -right-2">*</span>
        </div>

        <div className="relative">
          <input
            type="number"
            placeholder="Material Input Quantity (tons)"
            value={materialInputQuantity_tons}
            onChange={(e) => setMaterialInputQuantity_tons(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
          />
          <span className="text-red-500 text-lg absolute -top-1 -right-2">*</span>
        </div>

        <div className="relative">
          <input
            type="number"
            placeholder="Operating Temperature (°C)"
            value={operatingTemperature_C}
            onChange={(e) => setOperatingTemperature_C(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
          />
          <span className="text-red-500 text-lg absolute -top-1 -right-2">*</span>
        </div>

        <input
          type="number"
          placeholder="Energy Consumption (kWh/ton)"
          value={energyConsumption_kWh_per_ton}
          onChange={(e) => setEnergyConsumption_kWh_per_ton(e.target.value)}
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
          <option value="oil">Oil</option>
          <option value="coal">Coal</option>
          <option value="renewable">Renewable Energy</option>
          <option value="mixed">Mixed Sources</option>
        </select>

        <select
          value={moldMaterial}
          onChange={(e) => setMoldMaterial(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        >
          <option value="" disabled>Select Mold Material</option>
          <option value="sand">Sand</option>
          <option value="metal">Metal</option>
          <option value="ceramic">Ceramic</option>
          <option value="plaster">Plaster</option>
          <option value="investment">Investment Wax</option>
          <option value="permanent">Permanent Metal</option>
        </select>

        <select
          value={coolingMethod}
          onChange={(e) => setCoolingMethod(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        >
          <option value="" disabled>Select Cooling Method</option>
          <option value="air_cooling">Air Cooling</option>
          <option value="water_cooling">Water Cooling</option>
          <option value="forced_air">Forced Air</option>
          <option value="oil_quenching">Oil Quenching</option>
          <option value="natural_cooling">Natural Cooling</option>
          <option value="spray_cooling">Spray Cooling</option>
        </select>

        <input
          type="number"
          placeholder="Water Consumption (litre/ton)"
          value={waterConsumption_liters_per_ton}
          onChange={(e) => setWaterConsumption_liters_per_ton(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="text"
          placeholder="Emissions (kg CO2 equivalent/ton)"
          value={emissions}
          onChange={(e) => setEmissions(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Defect Rate (percent)"
          value={defectRate_percent}
          onChange={(e) => setDefectRate_percent(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Scrap Recycled (percent)"
          value={scrapRecycled_percent}
          onChange={(e) => setScrapRecycled_percent(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <select
          value={scrapQualityLevel}
          onChange={(e) => setScrapQualityLevel(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        >
          <option value="" disabled>Select Scrap Quality Level</option>
          <option value="high">High Quality</option>
          <option value="medium">Medium Quality</option>
          <option value="low">Low Quality</option>
          <option value="industrial_grade">Industrial Grade</option>
          <option value="commercial_grade">Commercial Grade</option>
        </select>

        <select
          value={packagingType}
          onChange={(e) => setPackagingType(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        >
          <option value="" disabled>Select Packaging Type</option>
          <option value="bulk">Bulk</option>
          <option value="palletized">Palletized</option>
          <option value="containerized">Containerized</option>
          <option value="crated">Crated</option>
          <option value="wrapped">Wrapped</option>
          <option value="bundled">Bundled</option>
        </select>

        <input
          type="number"
          placeholder="Final Product Yield (percent)"
          value={finalProductYield_percent}
          onChange={(e) => setFinalProductYield_percent(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Material Loss (percent)"
          value={materialLoss_percent}
          onChange={(e) => setMaterialLoss_percent(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Waste Generated (kg/ton)"
          value={wasteGenerated_kg_per_ton}
          onChange={(e) => setWasteGenerated_kg_per_ton(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Operating Cost (USD/ton)"
          value={operatingCost_per_ton}
          onChange={(e) => setOperatingCost_per_ton(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        {/* Submit Casting Data Button */}
        <button
          onClick={submitCastingData}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors w-[400px]"
        >
          {isLoading ? "Submitting..." : "Submit Casting Data"}
        </button>
        
        <div className="text-xs text-gray-500 mt-2">
          <span className="text-red-500">*</span> Required fields
        </div>
      </div>

      {/* Casting Success Modal */}
      {showCastingModal && castingResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-4">
              <div className="text-green-500 text-6xl mb-2">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Casting Data Submitted Successfully!</h2>
              <p className="text-gray-600">Your casting process data has been recorded.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Casting Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Process ID:</span>
                  <p className="text-gray-900 font-mono">{castingResponse.castingData?._id || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Process Type:</span>
                  <p className="text-gray-900">{castingResponse.castingData?.castingProcessType || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Material Input:</span>
                  <p className="text-gray-900">{castingResponse.castingData?.materialInputQuantity_tons || 'N/A'} tons</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Operating Temperature:</span>
                  <p className="text-gray-900">{castingResponse.castingData?.operatingTemperature_C || 'N/A'}°C</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Mold Material:</span>
                  <div className="text-gray-900">
                    {castingResponse.castingData?.moldMaterial && Array.isArray(castingResponse.castingData.moldMaterial) 
                      ? castingResponse.castingData.moldMaterial.map((mold: any, index: number) => (
                          <p key={index}>{mold.type}: {mold.amount_kg} kg</p>
                        ))
                      : castingResponse.castingData?.moldMaterial || 'N/A'
                    }
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Cooling Method:</span>
                  <p className="text-gray-900">{castingResponse.castingData?.coolingMethod || 'N/A'}</p>
                </div>
              </div>
            </div>

            {castingResponse.castingData && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Process Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {castingResponse.castingData.energyConsumption_kWh_per_ton && (
                    <div>
                      <span className="font-medium text-gray-700">Energy Consumption:</span>
                      <p className="text-gray-900">{castingResponse.castingData.energyConsumption_kWh_per_ton} kWh/ton</p>
                    </div>
                  )}
                  {castingResponse.castingData.energySource && (
                    <div>
                      <span className="font-medium text-gray-700">Energy Source:</span>
                      <div className="text-gray-900">
                        {Array.isArray(castingResponse.castingData.energySource) 
                          ? castingResponse.castingData.energySource.map((energy: any, index: number) => (
                              <p key={index}>{energy.type}: {energy.percent}%</p>
                            ))
                          : castingResponse.castingData.energySource
                        }
                      </div>
                    </div>
                  )}
                  {castingResponse.castingData.waterConsumption_liters_per_ton && (
                    <div>
                      <span className="font-medium text-gray-700">Water Consumption:</span>
                      <p className="text-gray-900">{castingResponse.castingData.waterConsumption_liters_per_ton} L/ton</p>
                    </div>
                  )}
                  {castingResponse.castingData.emissions && (
                    <div>
                      <span className="font-medium text-gray-700">Emissions:</span>
                      <div className="text-gray-900">
                        {typeof castingResponse.castingData.emissions === 'object' && castingResponse.castingData.emissions !== null ? (
                          <>
                            {castingResponse.castingData.emissions.CO2_kg_per_ton && (
                              <p>CO2: {castingResponse.castingData.emissions.CO2_kg_per_ton} kg/ton</p>
                            )}
                            {castingResponse.castingData.emissions.NOx_kg_per_ton && (
                              <p>NOx: {castingResponse.castingData.emissions.NOx_kg_per_ton} kg/ton</p>
                            )}
                            {castingResponse.castingData.emissions.SOx_kg_per_ton && (
                              <p>SOx: {castingResponse.castingData.emissions.SOx_kg_per_ton} kg/ton</p>
                            )}
                          </>
                        ) : (
                          <p>{castingResponse.castingData.emissions || 'N/A'}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {castingResponse.castingData.finalProductYield_percent && (
                    <div>
                      <span className="font-medium text-gray-700">Product Yield:</span>
                      <p className="text-gray-900">{castingResponse.castingData.finalProductYield_percent}%</p>
                    </div>
                  )}
                  {castingResponse.castingData.defectRate_percent && (
                    <div>
                      <span className="font-medium text-gray-700">Defect Rate:</span>
                      <p className="text-gray-900">{castingResponse.castingData.defectRate_percent}%</p>
                    </div>
                  )}
                  {castingResponse.castingData.materialLoss_percent && (
                    <div>
                      <span className="font-medium text-gray-700">Material Loss:</span>
                      <p className="text-gray-900">{castingResponse.castingData.materialLoss_percent}%</p>
                    </div>
                  )}
                  {castingResponse.castingData.operatingCost_per_ton && (
                    <div>
                      <span className="font-medium text-gray-700">Operating Cost:</span>
                      <p className="text-gray-900">${castingResponse.castingData.operatingCost_per_ton}/ton</p>
                    </div>
                  )}
                  {castingResponse.castingData.scrapRecycled_percent && (
                    <div>
                      <span className="font-medium text-gray-700">Scrap Recycled:</span>
                      <p className="text-gray-900">{castingResponse.castingData.scrapRecycled_percent}%</p>
                    </div>
                  )}
                  {castingResponse.castingData.scrapQualityLevel && (
                    <div>
                      <span className="font-medium text-gray-700">Scrap Quality:</span>
                      <p className="text-gray-900">{castingResponse.castingData.scrapQualityLevel}</p>
                    </div>
                  )}
                  {castingResponse.castingData.packagingType && (
                    <div>
                      <span className="font-medium text-gray-700">Packaging:</span>
                      <p className="text-gray-900">{castingResponse.castingData.packagingType}</p>
                    </div>
                  )}
                  {castingResponse.castingData.wasteGenerated_kg_per_ton && (
                    <div>
                      <span className="font-medium text-gray-700">Waste Generated:</span>
                      <p className="text-gray-900">{castingResponse.castingData.wasteGenerated_kg_per_ton} kg/ton</p>
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
                  const yield_percent = castingResponse.castingData?.finalProductYield_percent || 0;
                  const defectRate = castingResponse.castingData?.defectRate_percent || 0;
                  const materialLoss = castingResponse.castingData?.materialLoss_percent || 0;

                  if (yield_percent >= 95 && defectRate <= 2 && materialLoss <= 3) {
                    return (
                      <div className="flex items-center text-green-700">
                        <span className="text-lg mr-2">🌟</span>
                        <span>Excellent casting efficiency! High yield with minimal defects and material loss.</span>
                      </div>
                    );
                  } else if (yield_percent >= 90 && defectRate <= 5 && materialLoss <= 5) {
                    return (
                      <div className="flex items-center text-yellow-700">
                        <span className="text-lg mr-2">⚡</span>
                        <span>Good casting process. Consider optimizing to reduce defects and material loss.</span>
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex items-center text-orange-700">
                        <span className="text-lg mr-2">⚠️</span>
                        <span>Casting process needs improvement. Focus on reducing defects and material waste.</span>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleModalClose}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
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
