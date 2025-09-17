import { useState } from 'react';
import axios from 'axios';

interface RecyclingProps {
  projectId?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function Recycling({ projectId, onSuccess, onError }: RecyclingProps) {
  // State variables for recycling form
  const [recyclingProcessType, setRecyclingProcessType] = useState("");
  const [inputMaterialType, setInputMaterialType] = useState("");
  const [inputQuantity_tons, setInputQuantity_tons] = useState("");
  const [sortingMethod, setSortingMethod] = useState("");
  const [cleaningProcess, setCleaningProcess] = useState("");
  const [energyConsumption_kWh_per_ton, setEnergyConsumption_kWh_per_ton] = useState("");
  const [energySource, setEnergySource] = useState("");
  const [waterConsumption_liters_per_ton, setWaterConsumption_liters_per_ton] = useState("");
  const [chemicalUsed_kg_per_ton, setChemicalUsed_kg_per_ton] = useState("");
  const [materialRecoveryRate_percent, setMaterialRecoveryRate_percent] = useState("");
  const [materialLoss_percent, setMaterialLoss_percent] = useState("");
  const [outputQualityLevel, setOutputQualityLevel] = useState("");
  const [finalOutput_tons, setFinalOutput_tons] = useState("");
  const [emissions, setEmissions] = useState("");
  const [slagGenerated_kg_per_ton, setSlagGenerated_kg_per_ton] = useState("");
  const [hazardousWaste_kg_per_ton, setHazardousWaste_kg_per_ton] = useState("");
  const [packagingType, setPackagingType] = useState("");
  const [costOfRecycling_per_ton, setCostOfRecycling_per_ton] = useState("");

  // Transportation for recycling fields
  const [mode, setMode] = useState("");
  const [distance_km, setDistance_km] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [fuelConsumption_liters_per_km, setFuelConsumption_liters_per_km] = useState("");
  const [materialLossDuringTransport_percent, setMaterialLossDuringTransport_percent] = useState("");
  const [costPerTrip_USD, setCostPerTrip_USD] = useState("");

  // Loading and response states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [recyclingResponse, setRecyclingResponse] = useState<any>(null);
  const [showRecyclingModal, setShowRecyclingModal] = useState(false);

  const submitRecyclingData = async () => {
    // Validation for required fields
    if (!recyclingProcessType || !inputMaterialType || !inputQuantity_tons) {
      const errorMsg = "Please fill in all required fields: Recycling Process Type, Input Material Type, and Input Quantity";
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    const currentProjectId = projectId || "68c30b5357406494ce63b8f9";
    setIsLoading(true);
    setError("");

    try {
      const recyclingPayload = {
        recyclingProcessType,
        inputMaterialType,
        inputQuantity_tons: Number(inputQuantity_tons),
        sortingMethod: sortingMethod || undefined,
        cleaningProcess: cleaningProcess || undefined,
        energyConsumption_kWh_per_ton: energyConsumption_kWh_per_ton ? Number(energyConsumption_kWh_per_ton) : undefined,
        energySource: energySource || undefined,
        waterConsumption_liters_per_ton: waterConsumption_liters_per_ton ? Number(waterConsumption_liters_per_ton) : undefined,
        chemicalUsed_kg_per_ton: chemicalUsed_kg_per_ton ? Number(chemicalUsed_kg_per_ton) : undefined,
        materialRecoveryRate_percent: materialRecoveryRate_percent ? Number(materialRecoveryRate_percent) : undefined,
        materialLoss_percent: materialLoss_percent ? Number(materialLoss_percent) : undefined,
        outputQualityLevel: outputQualityLevel || undefined,
        finalOutput_tons: finalOutput_tons ? Number(finalOutput_tons) : undefined,
        emissions: emissions || undefined,
        slagGenerated_kg_per_ton: slagGenerated_kg_per_ton ? Number(slagGenerated_kg_per_ton) : undefined,
        hazardousWaste_kg_per_ton: hazardousWaste_kg_per_ton ? Number(hazardousWaste_kg_per_ton) : undefined,
        packagingType: packagingType || undefined,
        costOfRecycling_per_ton: costOfRecycling_per_ton ? Number(costOfRecycling_per_ton) : undefined,
        transportationForRecycling: (mode || distance_km || fuelType) ? {
          mode: mode || undefined,
          distance_km: distance_km ? Number(distance_km) : undefined,
          fuelType: fuelType || undefined,
          fuelConsumption_liters_per_km: fuelConsumption_liters_per_km ? Number(fuelConsumption_liters_per_km) : undefined,
          materialLossDuringTransport_percent: materialLossDuringTransport_percent ? Number(materialLossDuringTransport_percent) : undefined,
          costPerTrip_USD: costPerTrip_USD ? Number(costPerTrip_USD) : undefined,
        } : undefined,
      };

      const response = await axios.post(
        `https://metalyticsai-2.onrender.com//api/inventory/recycling/${currentProjectId}`,
        recyclingPayload
      );

      console.log("Recycling data submitted successfully:", response.data);
      setRecyclingResponse(response.data);
      setShowRecyclingModal(true);
      
      // Clear form after successful submission
      resetForm();
      
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error("Error submitting recycling data:", error);
      const errorMsg = error.response?.data?.message || "Failed to submit recycling data";
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setRecyclingProcessType("");
    setInputMaterialType("");
    setInputQuantity_tons("");
    setSortingMethod("");
    setCleaningProcess("");
    setEnergyConsumption_kWh_per_ton("");
    setEnergySource("");
    setWaterConsumption_liters_per_ton("");
    setChemicalUsed_kg_per_ton("");
    setMaterialRecoveryRate_percent("");
    setMaterialLoss_percent("");
    setOutputQualityLevel("");
    setFinalOutput_tons("");
    setEmissions("");
    setSlagGenerated_kg_per_ton("");
    setHazardousWaste_kg_per_ton("");
    setPackagingType("");
    setCostOfRecycling_per_ton("");
    // Transportation fields
    setMode("");
    setDistance_km("");
    setFuelType("");
    setFuelConsumption_liters_per_km("");
    setMaterialLossDuringTransport_percent("");
    setCostPerTrip_USD("");
    setError("");
  };

  const handleModalClose = () => {
    setShowRecyclingModal(false);
    setRecyclingResponse(null);
  };

  return (
    <>
      <div className="flex flex-col space-y-5 text-black">
        <span className="text-2xl font-semibold">Recycling</span>
        
        {/* Error Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="relative">
          <select
            value={recyclingProcessType}
            onChange={(e) => setRecyclingProcessType(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
          >
            <option value="" disabled>Select Recycling Process Type *</option>
            <option value="mechanical_recycling">Mechanical Recycling</option>
            <option value="chemical_recycling">Chemical Recycling</option>
            <option value="pyrometallurgical">Pyrometallurgical</option>
            <option value="hydrometallurgical">Hydrometallurgical</option>
            <option value="electrometallurgical">Electrometallurgical</option>
            <option value="re_smelting">Re-smelting</option>
            <option value="shredding_sorting">Shredding and Sorting</option>
          </select>
          <span className="text-red-500 text-lg absolute -top-1 -right-2">*</span>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Input Material Type"
            value={inputMaterialType}
            onChange={(e) => setInputMaterialType(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
          />
          <span className="text-red-500 text-lg absolute -top-1 -right-2">*</span>
        </div>

        <div className="relative">
          <input
            type="number"
            placeholder="Input Quantity (tons)"
            value={inputQuantity_tons}
            onChange={(e) => setInputQuantity_tons(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
          />
          <span className="text-red-500 text-lg absolute -top-1 -right-2">*</span>
        </div>

        <select
          value={sortingMethod}
          onChange={(e) => setSortingMethod(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        >
          <option value="" disabled>Select Sorting Method</option>
          <option value="manual_sorting">Manual Sorting</option>
          <option value="magnetic_separation">Magnetic Separation</option>
          <option value="eddy_current">Eddy Current Separation</option>
          <option value="optical_sorting">Optical Sorting</option>
          <option value="density_separation">Density Separation</option>
          <option value="size_screening">Size Screening</option>
        </select>

        <select
          value={cleaningProcess}
          onChange={(e) => setCleaningProcess(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        >
          <option value="" disabled>Select Cleaning Process</option>
          <option value="washing">Washing</option>
          <option value="degreasing">Degreasing</option>
          <option value="chemical_cleaning">Chemical Cleaning</option>
          <option value="thermal_cleaning">Thermal Cleaning</option>
          <option value="abrasive_cleaning">Abrasive Cleaning</option>
          <option value="ultrasonic_cleaning">Ultrasonic Cleaning</option>
        </select>

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
          <option value="renewable">Renewable Energy</option>
          <option value="mixed">Mixed Sources</option>
        </select>

        <input
          type="number"
          placeholder="Water Consumption (liters/ton)"
          value={waterConsumption_liters_per_ton}
          onChange={(e) => setWaterConsumption_liters_per_ton(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Chemical Used (kg/ton)"
          value={chemicalUsed_kg_per_ton}
          onChange={(e) => setChemicalUsed_kg_per_ton(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Material Recovery Rate (percent)"
          value={materialRecoveryRate_percent}
          onChange={(e) => setMaterialRecoveryRate_percent(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Material Loss (percent)"
          value={materialLoss_percent}
          onChange={(e) => setMaterialLoss_percent(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <select
          value={outputQualityLevel}
          onChange={(e) => setOutputQualityLevel(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        >
          <option value="" disabled>Select Output Quality Level</option>
          <option value="high">High Quality</option>
          <option value="medium">Medium Quality</option>
          <option value="low">Low Quality</option>
          <option value="industrial_grade">Industrial Grade</option>
          <option value="commercial_grade">Commercial Grade</option>
        </select>

        <input
          type="number"
          placeholder="Final Output (tons)"
          value={finalOutput_tons}
          onChange={(e) => setFinalOutput_tons(e.target.value)}
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
          placeholder="Slag Generated (kg/ton)"
          value={slagGenerated_kg_per_ton}
          onChange={(e) => setSlagGenerated_kg_per_ton(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Hazardous Waste (kg/ton)"
          value={hazardousWaste_kg_per_ton}
          onChange={(e) => setHazardousWaste_kg_per_ton(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <select
          value={packagingType}
          onChange={(e) => setPackagingType(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        >
          <option value="" disabled>Select Packaging Type</option>
          <option value="bulk">Bulk</option>
          <option value="palletized">Palletized</option>
          <option value="containerized">Containerized</option>
          <option value="bagged">Bagged</option>
          <option value="bundled">Bundled</option>
        </select>

        <input
          type="number"
          placeholder="Cost of Recycling (USD/ton)"
          value={costOfRecycling_per_ton}
          onChange={(e) => setCostOfRecycling_per_ton(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        {/* Transportation for Recycling Section */}
        <span className="text-xl font-semibold mt-[20px]">Transportation for Recycling</span>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        >
          <option value="" disabled>Select Mode of Transport</option>
          <option value="truck">Truck</option>
          <option value="rail">Rail</option>
          <option value="ship">Ship</option>
          <option value="conveyor">Conveyor Belt</option>
          <option value="multimodal">Multimodal</option>
        </select>

        <input
          type="number"
          placeholder="Distance (km)"
          value={distance_km}
          onChange={(e) => setDistance_km(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <select
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        >
          <option value="" disabled>Select Fuel Type</option>
          <option value="diesel">Diesel</option>
          <option value="gasoline">Gasoline</option>
          <option value="electricity">Electricity</option>
          <option value="natural_gas">Natural Gas</option>
          <option value="biodiesel">Biodiesel</option>
        </select>

        <input
          type="number"
          placeholder="Fuel Consumption (liters/km)"
          value={fuelConsumption_liters_per_km}
          onChange={(e) => setFuelConsumption_liters_per_km(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Material Loss During Transport (percent)"
          value={materialLossDuringTransport_percent}
          onChange={(e) => setMaterialLossDuringTransport_percent(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Cost per Trip (USD)"
          value={costPerTrip_USD}
          onChange={(e) => setCostPerTrip_USD(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        {/* Submit Recycling Data Button */}
        <button
          onClick={submitRecyclingData}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors w-[400px]"
        >
          {isLoading ? "Submitting..." : "Submit Recycling Data"}
        </button>
        
        <div className="text-xs text-gray-500 mt-2">
          <span className="text-red-500">*</span> Required fields
        </div>
      </div>

      {/* Recycling Success Modal */}
      {showRecyclingModal && recyclingResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-4">
              <div className="text-green-500 text-6xl mb-2">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recycling Data Submitted Successfully!</h2>
              <p className="text-gray-600">Your recycling process data has been recorded.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Recycling Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Process ID:</span>
                  <p className="text-gray-900 font-mono">{recyclingResponse.recyclingData?._id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Process Type:</span>
                  <p className="text-gray-900">{recyclingResponse.recyclingData?.recyclingProcessType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Input Material:</span>
                  <p className="text-gray-900">{recyclingResponse.recyclingData?.inputMaterialType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Input Quantity:</span>
                  <p className="text-gray-900">{recyclingResponse.recyclingData?.inputQuantity_tons} tons</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Output Quality:</span>
                  <p className="text-gray-900">{recyclingResponse.recyclingData?.outputQualityLevel || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Final Output:</span>
                  <p className="text-gray-900">{recyclingResponse.recyclingData?.finalOutput_tons || 'N/A'} tons</p>
                </div>
              </div>
            </div>

            {recyclingResponse.recyclingData && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Process Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {recyclingResponse.recyclingData.materialRecoveryRate_percent && (
                    <div>
                      <span className="font-medium text-gray-700">Recovery Rate:</span>
                      <p className="text-gray-900">{recyclingResponse.recyclingData.materialRecoveryRate_percent}%</p>
                    </div>
                  )}
                  {recyclingResponse.recyclingData.materialLoss_percent && (
                    <div>
                      <span className="font-medium text-gray-700">Material Loss:</span>
                      <p className="text-gray-900">{recyclingResponse.recyclingData.materialLoss_percent}%</p>
                    </div>
                  )}
                  {recyclingResponse.recyclingData.energyConsumption_kWh_per_ton && (
                    <div>
                      <span className="font-medium text-gray-700">Energy Consumption:</span>
                      <p className="text-gray-900">{recyclingResponse.recyclingData.energyConsumption_kWh_per_ton} kWh/ton</p>
                    </div>
                  )}
                  {recyclingResponse.recyclingData.costOfRecycling_per_ton && (
                    <div>
                      <span className="font-medium text-gray-700">Recycling Cost:</span>
                      <p className="text-gray-900">${recyclingResponse.recyclingData.costOfRecycling_per_ton}/ton</p>
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
                Complete LCA Process
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}