// import React, { useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export default function Comparison(params: any) {
    const comparisonData = params.data || params;

    // Safety check for data
    if (!comparisonData || !comparisonData.radar_chart || !comparisonData.linearVsCircular) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">No comparison data available to display.</p>
                </div>
            </div>
        );
    }

    const { radar_chart, linearVsCircular } = comparisonData;

    // Prepare radar chart data
    const radarData = {
        labels: radar_chart.labels,
        datasets: radar_chart.datasets.map((dataset: any, index: number) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: index === 0 
                ? 'rgba(239, 68, 68, 0.1)' // Red for Linear
                : 'rgba(34, 197, 94, 0.1)', // Green for Circular
            borderColor: index === 0 
                ? 'rgba(239, 68, 68, 0.8)'
                : 'rgba(34, 197, 94, 0.8)',
            borderWidth: 2,
            pointBackgroundColor: index === 0 
                ? 'rgba(239, 68, 68, 1)'
                : 'rgba(34, 197, 94, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
        }))
    };

    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold' as const
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                callbacks: {
                    label: function(context: any) {
                        return `${context.dataset.label}: ${context.parsed.r}%`;
                    }
                }
            }
        },
        scales: {
            r: {
                angleLines: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: {
                    stepSize: 20,
                    font: {
                        size: 12
                    }
                },
                pointLabels: {
                    font: {
                        size: 13,
                        weight: 'bold' as const
                    },
                    color: 'rgba(0, 0, 0, 0.8)'
                }
            }
        }
    };

    // Helper function to format values
    const formatValue = (value: number | undefined | null, unit: string = "") => {
        if (value === undefined || value === null || isNaN(value)) {
            return "N/A";
        }
        return `${value.toLocaleString()}${unit}`;
    };

    // Helper function to get improvement color
    const getImprovementColor = (improvement: string) => {
        if (improvement.includes('reduction') || improvement.includes('increase')) {
            return 'text-green-600';
        }
        return 'text-blue-600';
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Linear vs Circular Economy Comparison</h1>
                <p className="text-gray-600">Comprehensive analysis of sustainability metrics across economic models</p>
            </div>

            {/* Radar Chart Section */}
            <div className="bg-white border border-gray-300 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Performance Radar Chart</h2>
                <div className="h-96 flex items-center justify-center">
                    <div className="w-full h-full max-w-2xl">
                        <Radar data={radarData} options={radarOptions} />
                    </div>
                </div>
                <div className="mt-4 text-center text-sm text-gray-600">
                    <p>Higher values indicate better performance in each sustainability dimension</p>
                </div>
            </div>

            {/* Key Indicators Comparison */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Performance Indicators</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {linearVsCircular.keyIndicators.map((indicator: any, index: number) => (
                        <div key={indicator._id || index} className="bg-white border border-gray-300 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{indicator.metric}</h3>
                            
                            {/* Linear vs Circular Bars */}
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-red-700">Linear Model</span>
                                        <span className="text-sm font-bold text-red-700">
                                            {formatValue(indicator.linear, indicator.unit)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-red-500 h-2 rounded-full"
                                            style={{ 
                                                width: indicator.unit === '%' 
                                                    ? `${Math.min(indicator.linear, 100)}%`
                                                    : `${Math.min((indicator.linear / Math.max(indicator.linear, indicator.circular)) * 100, 100)}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-green-700">Circular Model</span>
                                        <span className="text-sm font-bold text-green-700">
                                            {formatValue(indicator.circular, indicator.unit)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ 
                                                width: indicator.unit === '%' 
                                                    ? `${Math.min(indicator.circular, 100)}%`
                                                    : `${Math.min((indicator.circular / Math.max(indicator.linear, indicator.circular)) * 100, 100)}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Improvement Badge */}
                            <div className="mt-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getImprovementColor(indicator.improvement)} bg-green-50 border border-green-200`}>
                                    📈 {indicator.improvement}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Comparison Table */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Metrics Comparison</h2>
                <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Metric
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Linear Model
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Circular Model
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Difference
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[
                                { name: 'Virgin Material Use', linear: linearVsCircular.linearModel.rawMaterialUse_percentVirgin, circular: linearVsCircular.circularModel.rawMaterialUse_percentVirgin, unit: '%' },
                                { name: 'Recycled Content', linear: linearVsCircular.linearModel.recycledContent_percent, circular: linearVsCircular.circularModel.recycledContent_percent, unit: '%' },
                                { name: 'Landfill Rate', linear: linearVsCircular.linearModel.landfillRate_percent, circular: linearVsCircular.circularModel.landfillRate_percent, unit: '%' },
                                { name: 'Reuse Rate', linear: linearVsCircular.linearModel.reuseRate_percent, circular: linearVsCircular.circularModel.reuseRate_percent, unit: '%' },
                                { name: 'Product Life', linear: linearVsCircular.linearModel.productLife_years, circular: linearVsCircular.circularModel.productLife_years, unit: ' years' },
                                { name: 'Waste Generated', linear: linearVsCircular.linearModel.wasteGenerated_kgPerTon, circular: linearVsCircular.circularModel.wasteGenerated_kgPerTon, unit: ' kg/ton' },
                                { name: 'Energy Consumption', linear: linearVsCircular.linearModel.energyConsumption_kWhPerTon, circular: linearVsCircular.circularModel.energyConsumption_kWhPerTon, unit: ' kWh/ton' },
                                { name: 'CO2 Emissions', linear: linearVsCircular.linearModel.CO2Emissions_kgPerTon, circular: linearVsCircular.circularModel.CO2Emissions_kgPerTon, unit: ' kg/ton' }
                            ].map((metric, index) => {
                                const difference = ((metric.circular - metric.linear) / metric.linear * 100).toFixed(1);
                                const isImprovement = (metric.name === 'Recycled Content' || metric.name === 'Reuse Rate' || metric.name === 'Product Life') 
                                    ? parseFloat(difference) > 0 
                                    : parseFloat(difference) < 0;
                                
                                return (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {metric.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-red-700 font-semibold">
                                            {formatValue(metric.linear, metric.unit)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-700 font-semibold">
                                            {formatValue(metric.circular, metric.unit)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            <span className={`font-medium ${isImprovement ? 'text-green-600' : 'text-red-600'}`}>
                                                {isImprovement ? '↗️' : '↘️'} {Math.abs(parseFloat(difference))}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Gap Analysis */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gap Analysis</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="space-y-3">
                        {linearVsCircular.gapAnalysis.map((gap: string, index: number) => (
                            <div key={index} className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                        <span className="text-red-600 font-bold text-sm">!</span>
                                    </div>
                                </div>
                                <p className="ml-3 text-sm text-red-800">{gap}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions to Take */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Transition Actions</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {linearVsCircular.actionsToTake.map((action: string, index: number) => (
                            <div key={index} className="bg-white border border-blue-300 rounded-lg p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                                        </div>
                                    </div>
                                    <p className="ml-3 text-sm font-medium text-gray-900">{action}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Linear Model</h3>
                    <p className="text-3xl font-bold text-red-600">Traditional</p>
                    <p className="text-sm text-red-700 mt-2">Take-Make-Dispose approach with high resource consumption</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Circular Model</h3>
                    <p className="text-3xl font-bold text-green-600">Sustainable</p>
                    <p className="text-sm text-green-700 mt-2">Reduce-Reuse-Recycle with optimized resource flows</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Improvement Potential</h3>
                    <p className="text-3xl font-bold text-blue-600">High</p>
                    <p className="text-sm text-blue-700 mt-2">Significant gains across all sustainability metrics</p>
                </div>
            </div>

            {/* Debug Section (remove in production) */}
            <details className="mt-8">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Debug: Raw Data Structure
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto">
                    {JSON.stringify(comparisonData, null, 2)}
                </pre>
            </details>
        </div>
    );
}
