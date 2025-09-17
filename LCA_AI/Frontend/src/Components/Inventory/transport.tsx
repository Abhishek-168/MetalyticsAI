import  { useState } from 'react';
import axios from 'axios';

interface TransportationProps {
  projectId?: string;
  stage?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function Transportation({ 
  projectId, 
  stage = 'transport-refinery', // ← Fix: change from 'transport_to_refinery' to 'transport-refinery'
  onSuccess, 
  onError 
}: TransportationProps) {
  // State variables for transportation form
  const [mode, setMode] = useState("");
  const [distanceTravelled_km, setDistanceTravelled_km] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [fuelConsumption_perKm, setFuelConsumption_perKm] = useState("");
  const [loadCapacityUtilization_percent, setLoadCapacityUtilization_percent] = useState("");
  const [averageVehicleLoad_tons, setAverageVehicleLoad_tons] = useState("");
  const [packagingType, setPackagingType] = useState("");
  const [materialLossDuringTransport_percent, setMaterialLossDuringTransport_percent] = useState("");
  const [costOfTransport_perTrip_USD, setCostOfTransport_perTrip_USD] = useState("");

  // Loading and response states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [transportResponse, setTransportResponse] = useState<any>(null);
  const [showTransportModal, setShowTransportModal] = useState(false);

  // Get title based on stage
  const getTitle = () => {
    switch (stage) {
      case 'transport-refinery': // ← Fix: change from 'transport_to_refinery'
        return 'Transport to Refinery';
      case 'transport-consumer': // ← Fix: change from 'transport_to_consumer'
        return 'Transport to Consumer';
      default:
        return 'Transportation';
    }
  };

  const submitTransportData = async () => {
    // Validation for required fields
    if (!mode || !distanceTravelled_km || !fuelType) {
      const errorMsg = "Please fill in all required fields: Mode of Transport, Distance, and Fuel Type";
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    const currentProjectId = projectId || "68c30b5357406494ce63b8f9";
    setIsLoading(true);
    setError("");

    try {
      const transportPayload = {
        mode,
        distanceTravelled_km: Number(distanceTravelled_km),
        fuelType,
        fuelConsumption_perKm: fuelConsumption_perKm ? Number(fuelConsumption_perKm) : undefined,
        loadCapacityUtilization_percent: loadCapacityUtilization_percent ? Number(loadCapacityUtilization_percent) : undefined,
        averageVehicleLoad_tons: averageVehicleLoad_tons ? Number(averageVehicleLoad_tons) : undefined,
        packagingType: packagingType || undefined,
        materialLossDuringTransport_percent: materialLossDuringTransport_percent ? Number(materialLossDuringTransport_percent) : undefined,
        costOfTransport_perTrip_USD: costOfTransport_perTrip_USD ? Number(costOfTransport_perTrip_USD) : undefined,
        stage
      };

      const response = await axios.post(
        `https://metalyticsai-2.onrender.com/api/inventory/transportation/${currentProjectId}`,
        transportPayload
      );

      console.log("Transport data submitted successfully:", response.data);
      setTransportResponse(response.data);
      setShowTransportModal(true);
      
      // Clear form after successful submission
      resetForm();
      
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error("Error submitting transport data:", error);
      const errorMsg = error.response?.data?.message || "Failed to submit transport data";
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setMode("");
    setDistanceTravelled_km("");
    setFuelType("");
    setFuelConsumption_perKm("");
    setLoadCapacityUtilization_percent("");
    setAverageVehicleLoad_tons("");
    setPackagingType("");
    setMaterialLossDuringTransport_percent("");
    setCostOfTransport_perTrip_USD("");
    setError("");
  };

  const handleModalClose = () => {
    setShowTransportModal(false);
    setTransportResponse(null);
  };

  return (
    <>
      <div className="flex flex-col space-y-5 text-black mt-10">
        <span className="text-2xl font-semibold">{getTitle()}</span>
        
        {/* Error Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="relative">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
          >
            <option value="" disabled>Select Mode of Transport *</option>
            <option value="truck">Truck</option>
            <option value="rail">Rail</option>
            <option value="ship">Ship</option>
            <option value="pipeline">Pipeline</option>
            <option value="conveyor">Conveyor Belt</option>
            <option value="barge">Barge</option>
            <option value="multimodal">Multimodal</option>
          </select>
          <span className="text-red-500 text-lg absolute -top-1 -right-2">*</span>
        </div>

        <div className="relative">
          <input
            type="number"
            placeholder="Distance travelled (km)"
            value={distanceTravelled_km}
            onChange={(e) => setDistanceTravelled_km(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
          />
          <span className="text-red-500 text-lg absolute -top-1 -right-2">*</span>
        </div>

        <div className="relative">
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
          >
            <option value="" disabled>Select Fuel Type *</option>
            <option value="diesel">Diesel</option>
            <option value="gasoline">Gasoline</option>
            <option value="electricity">Electricity</option>
            <option value="natural_gas">Natural Gas</option>
            <option value="biodiesel">Biodiesel</option>
            <option value="hydrogen">Hydrogen</option>
            <option value="heavy_fuel_oil">Heavy Fuel Oil</option>
            <option value="coal">Coal (for rail)</option>
          </select>
          <span className="text-red-500 text-lg absolute -top-1 -right-2">*</span>
        </div>

        <input
          type="number"
          placeholder="Fuel Consumption per km (L/km)"
          value={fuelConsumption_perKm}
          onChange={(e) => setFuelConsumption_perKm(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Load Capacity Utilization (percent)"
          value={loadCapacityUtilization_percent}
          onChange={(e) => setLoadCapacityUtilization_percent(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Average Vehicle Load (tons)"
          value={averageVehicleLoad_tons}
          onChange={(e) => setAverageVehicleLoad_tons(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <select
          value={packagingType}
          onChange={(e) => setPackagingType(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        >
          <option value="" disabled>Select Packaging Type</option>
          <option value="bulk">Bulk</option>
          <option value="containerized">Containerized</option>
          <option value="palletized">Palletized</option>
          <option value="bagged">Bagged</option>
          <option value="wrapped">Wrapped</option>
          <option value="loose">Loose</option>
        </select>

        <input
          type="number"
          placeholder="Material Loss During Transport (percent)"
          value={materialLossDuringTransport_percent}
          onChange={(e) => setMaterialLossDuringTransport_percent(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        <input
          type="number"
          placeholder="Cost of Transport per Trip (USD)"
          value={costOfTransport_perTrip_USD}
          onChange={(e) => setCostOfTransport_perTrip_USD(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2 w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />

        {/* Submit Transport Data Button */}
        <button
          onClick={submitTransportData}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors w-[400px]"
        >
          {isLoading ? "Submitting..." : "Submit Transport Data"}
        </button>
        
        <div className="text-xs text-gray-500 mt-2">
          <span className="text-red-500">*</span> Required fields
        </div>
      </div>

      {/* Transport Success Modal */}
      {showTransportModal && transportResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-4">
              <div className="text-green-500 text-6xl mb-2">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Transport Data Submitted Successfully!</h2>
              <p className="text-gray-600">Your transportation process data has been recorded.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Transport Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Process ID:</span>
                  <p className="text-gray-900 font-mono">{transportResponse.transportationData?._id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Mode of Transport:</span>
                  <p className="text-gray-900">{transportResponse.transportationData?.mode}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Distance:</span>
                  <p className="text-gray-900">{transportResponse.transportationData?.distanceTravelled_km} km</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Fuel Type:</span>
                  <p className="text-gray-900">{transportResponse.transportationData?.fuelType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Stage:</span>
                  <p className="text-gray-900">{transportResponse.stage}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Packaging:</span>
                  <p className="text-gray-900">{transportResponse.transportationData?.packagingType || 'N/A'}</p>
                </div>
              </div>
            </div>

            {transportResponse.transportationData && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Resource Consumption</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {transportResponse.transportationData.fuelConsumption_perKm && (
                    <div>
                      <span className="font-medium text-gray-700">Fuel per km:</span>
                      <p className="text-gray-900">{transportResponse.transportationData.fuelConsumption_perKm} L/km</p>
                    </div>
                  )}
                  {transportResponse.transportationData.loadCapacityUtilization_percent && (
                    <div>
                      <span className="font-medium text-gray-700">Load Utilization:</span>
                      <p className="text-gray-900">{transportResponse.transportationData.loadCapacityUtilization_percent}%</p>
                    </div>
                  )}
                  {transportResponse.transportationData.averageVehicleLoad_tons && (
                    <div>
                      <span className="font-medium text-gray-700">Vehicle Load:</span>
                      <p className="text-gray-900">{transportResponse.transportationData.averageVehicleLoad_tons} tons</p>
                    </div>
                  )}
                  {transportResponse.transportationData.materialLossDuringTransport_percent && (
                    <div>
                      <span className="font-medium text-gray-700">Material Loss:</span>
                      <p className="text-gray-900">{transportResponse.transportationData.materialLossDuringTransport_percent}%</p>
                    </div>
                  )}
                  {transportResponse.transportationData.costOfTransport_perTrip_USD && (
                    <div>
                      <span className="font-medium text-gray-700">Transport Cost:</span>
                      <p className="text-gray-900">${transportResponse.transportationData.costOfTransport_perTrip_USD}/trip</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Environmental Impact Summary */}
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Environmental Impact Summary</h3>
              <div className="text-sm">
                {(() => {
                  const distance = transportResponse.transportationData?.distanceTravelled_km || 0;
                  const fuelConsumption = transportResponse.transportationData?.fuelConsumption_perKm || 0;
                  // const totalFuel = distance * fuelConsumption;

                  if (distance < 500 && fuelConsumption < 0.4) {
                    return (
                      <div className="flex items-center text-green-700">
                        <span className="text-lg mr-2">🌟</span>
                        <span>Excellent! Low distance and efficient fuel consumption minimize environmental impact.</span>
                      </div>
                    );
                  } else if (distance < 1000 && fuelConsumption < 0.6) {
                    return (
                      <div className="flex items-center text-yellow-700">
                        <span className="text-lg mr-2">⚡</span>
                        <span>Good transportation efficiency. Consider optimizing routes or using cleaner fuels.</span>
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex items-center text-orange-700">
                        <span className="text-lg mr-2">⚠️</span>
                        <span>High environmental impact. Consider multimodal transport or route optimization.</span>
                      </div>
                    );
                  }
                })()}
                
                {transportResponse.transportationData?.fuelConsumption_perKm && transportResponse.transportationData?.distanceTravelled_km && (
                  <div className="mt-2 p-2 bg-white rounded text-xs">
                    <span className="font-medium">Total Fuel Consumption: </span>
                    {(transportResponse.transportationData.fuelConsumption_perKm * transportResponse.transportationData.distanceTravelled_km).toFixed(2)} L
                  </div>
                )}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleModalClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
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