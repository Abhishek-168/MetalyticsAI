// import Chatbot from "./chatbot";

export default function Core(params: any) {
    const core = params.data || params;

    // Safety check for data
    if (!core) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">No environmental data available to display.</p>
                </div>
            </div>
        );
    }

    // Helper function to format numbers
    const formatValue = (value: number | undefined | null) => {
        if (value === undefined || value === null || isNaN(value)) {
            return "N/A";
        }
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(2)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(2)}k`;
        }
        return value.toLocaleString();
    };

    // Function to get status based on metric thresholds
    const getMetricStatus = (value: number | undefined | null, metricType: string) => {
        if (value === undefined || value === null || isNaN(value)) {
            return { status: 'N/A', colorClass: 'bg-gray-500' };
        }

        const thresholds: Record<string, { green: number; red: number }> = {
            'globalWarming': { green: 1000, red: 2500 },
            'acidification': { green: 20, red: 60 },
            'eutrophication': { green: 5, red: 10 },
            'ozoneDepletion': { green: 0.001, red: 0.005 },
            'energy': { green: 15000, red: 30000 },
            'waterFootprint': { green: 10000, red: 30000 },
            'waterUse': { green: 10, red: 25 },
            'landUse': { green: 200, red: 400 },
            'landImpact': { green: 5, red: 10 },
            'photochemicalSmog': { green: 2, red: 5 },
            'humanToxicity': { green: 50, red: 150 },
            'ecoToxicity': { green: 50, red: 200 }
        };

        const threshold = thresholds[metricType];
        if (!threshold) return { status: 'Unknown', colorClass: 'bg-gray-500' };

        if (value < threshold.green) {
            return { status: 'Good', colorClass: 'bg-green-500' };
        } else if (value <= threshold.red) {
            return { status: 'Moderate', colorClass: 'bg-yellow-500' };
        } else {
            return { status: 'Poor', colorClass: 'bg-red-500' };
        }
    };

    // All metrics for the table
    const allMetrics = [
        {
            name: "Global Warming Potential",
            value: core.globalWarmingPotential_kg_CO2_eq,
            unit: "kg CO₂ eq",
            metricType: 'globalWarming'
        },
        {
            name: "Acidification Potential",
            value: core.acidificationPotential_kg_SO2_eq,
            unit: "kg SO₂ eq",
            metricType: 'acidification'
        },
        {
            name: "Eutrophication Potential",
            value: core.eutrophicationPotential_kg_PO4_eq,
            unit: "kg PO₄ eq",
            metricType: 'eutrophication'
        },
        {
            name: "Ozone Depletion Potential",
            value: core.ozoneDepletionPotential_kg_CFC11_eq,
            unit: "kg CFC-11 eq",
            metricType: 'ozoneDepletion'
        },
        {
            name: "Photochemical Smog",
            value: core.photochemicalSmogPotential_kgC2H4eq,
            unit: "kg C₂H₄ eq",
            metricType: 'photochemicalSmog'
        },
        {
            name: "Human Toxicity",
            value: core.humanToxicity_kg14DCBeq,
            unit: "kg 1,4-DCB eq",
            metricType: 'humanToxicity'
        },
        {
            name: "Eco Toxicity",
            value: core.ecoToxicity_kg14DCBeq,
            unit: "kg 1,4-DCB eq",
            metricType: 'ecoToxicity'
        },
        {
            name: "Cumulative Energy Demand",
            value: core.cumulativeEnergyDemand_MJ,
            unit: "MJ",
            metricType: 'energy'
        },
        {
            name: "Water Footprint",
            value: core.waterFootprint_L,
            unit: "L",
            metricType: 'waterFootprint'
        },
        {
            name: "Water Use",
            value: core.waterUse_m3,
            unit: "m³",
            metricType: 'waterUse'
        },
        {
            name: "Land Use",
            value: core.landUse_m2,
            unit: "m²",
            metricType: 'landUse'
        },
        {
            name: "Land Impact",
            value: core.landImpact_m2_year,
            unit: "m²·year",
            metricType: 'landImpact'
        }
    ];

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
          <div className="flex gap-20">
            <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Environmental Impact Assessment</h1>
                <p className="text-gray-600">{core.description}</p>
                <p className="text-sm text-gray-500">Assessment ID: {core.resultId}</p>
            </div>

            {/* Simple Table */}
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Environmental Metric
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Value
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Unit
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {allMetrics.map((metric, index) => {
                            const status = getMetricStatus(metric.value, metric.metricType);
                            return (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-b">
                                        {metric.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                                        {formatValue(metric.value)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b">
                                        {metric.unit}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b">
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full ${status.colorClass} mr-2`}></div>
                                            <span className="font-medium">{status.status}</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Good</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span>Moderate</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span>Poor</span>
                </div>
            </div>
            </div>
            
            
          </div>
            {/* Action Items */}
            {core.actionsToTake && core.actionsToTake.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Actions</h2>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <ol className="list-decimal list-inside space-y-2">
                            {core.actionsToTake.map((action: string, index: number) => (
                                <li key={index} className="text-gray-700">{action}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            )}
        </div>
    );
}
