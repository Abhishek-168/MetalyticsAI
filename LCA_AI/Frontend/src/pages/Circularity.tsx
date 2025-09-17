
import axios from "axios";
import { useEffect, useState } from "react";
const Base_URL = "https://metalyticsai-2.onrender.com"
import { useParams } from "react-router-dom";
import Strategies from "../Components/stratigies";
import Matrics from "../Components/matrics";
import StageActions from "../Components/stageAction";
import Comparison from "../Components/comparison";
import Gauge from "../Components/gauge";

export default function Circularity() {

const { id: projectid } = useParams();
const [matrics, setMatrics] = useState<any>(null);
const [strategies, setStrategies] = useState<any>(null);
const [stageActions, setStageActions] = useState<any>(null);
const [comparison, setComparison] = useState<any>(null);
const [gauge, setGauge] = useState<any>(null);


  useEffect(() => {
    // Fetch circularity results based on projectid
    const fetchResults = async () => {
      console.log("Project ID:", projectid);
      console.log("Base URL:", Base_URL);
      console.log("Full URL:", `${Base_URL}/api/results/circularity/${projectid}`);
      
      try {
        const response = await axios.get(`${Base_URL}/api/results/circularity/${projectid}`);
        

        
        
        // Check if circularity data exists
        if (response.data && response.data.circularity) {
          console.log("Circularity data found:", response.data.circularity);
          setMatrics(response.data.circularity.metrics);
          setStrategies(response.data.circularity.strategies);
          setStageActions(response.data.circularity.stageWiseCircularityActions);
          setComparison(response.data.circularity.comparison);
          setGauge(response.data.circularity.gauge);
        } else {
          console.warn("No circularity data found in response");
          console.log("Available keys in response.data:", Object.keys(response.data || {}));
        }
      } catch (error: any) {
        console.error("Error fetching circularity results:", error);
        console.error("Error details:", error.response?.data || error.message);
      }
    };

    if (projectid) {
      fetchResults();
    } else {
      console.warn("No project ID provided");
    }
  }, [projectid]);

  return (
    <div>
      {matrics && <Matrics data={matrics} />}
      {gauge && <Gauge data={gauge} />}
      {strategies && <Strategies data={strategies} />}
      {stageActions && <StageActions data={stageActions} />}
      {comparison && <Comparison data={comparison} />}
    </div>
  );
}
