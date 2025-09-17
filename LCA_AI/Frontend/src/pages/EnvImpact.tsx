

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Core from '../Components/core'
import Polution from '../Components/Polution'
import StageWise from '../Components/StageWise';
import Resource from '../Components/resourse';
const Base_URL = "https://metalyticsai-2.onrender.com"

export default function EnvImpact() {
  const { id: projectid }  = useParams();
  const [core, setCore] = useState<any>(null);
  const [stagewise, setStagewise] = useState<any>(null);
  const [TotalPollution, setTotalPollution] = useState<any>(null);
  const [resourceEfficiency, setResourceEfficiency] = useState<any>(null);

  useEffect(() => {
    // Fetch environmental impact results based on projectid
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${Base_URL}/api/results/envimpact/${projectid}`);
        
        console.log("Environmental Impact Results:", response.data);
        setCore(response.data.environmentalImpact.core);
        setStagewise(response.data.environmentalImpact.stageWiseBreakdown);
        setTotalPollution(response.data.environmentalImpact.totalPollutionOutput);
        setResourceEfficiency(response.data.environmentalImpact.resourceEfficiency);
        
      } catch (error) {
        console.error("Error fetching environmental impact results:", error);
      }
    };

    fetchResults();
  }, [projectid]);



  return (

    <div>
      <h1>Project Results</h1>
      <Core data={core} />
      <StageWise data={stagewise} />
      <Polution data={TotalPollution} />
      <Resource data={resourceEfficiency} />
    </div>
  );
}
