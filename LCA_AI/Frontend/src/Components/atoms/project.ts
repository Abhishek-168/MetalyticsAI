import { selectorFamily } from 'recoil';
// import type Casting from '../Inventory/casting';
const BASE_URL =  'https://metalyticsai-2.onrender.com/';

const defaMD = {
        project_id: "1234",
        project_name: "Sample Project",
        metal_type: "Aluminum",
        goal: "Assess environmental impact",
        system_boundary: "Cradle to Grave",
        functional_unit: "1 ton of aluminum product",
        inventory: {
                extraction: 1,
                Tport_to_refinary: 1,
                refining: 1,
                smelting: 1,
                Casting: 1,
                Tport_to_consumer: 1,
                usage_phase: 1,
                Recycle: 1,
                end_of_life: 1
            },
        results: 1
        
    };

export const Project_meta = selectorFamily({
  key: "Project_meta",
  get: (id:string) => async () => {
    try{
      const response = await fetch(`${BASE_URL}/api/inventory/metadata/${id}`);
      const data = await response.json();
      console.log("Fetched metadata:", data);
      return data.meta;
    } catch (error) {
      console.error("Error fetching metadata:", error);
      return defaMD;
    }
  },
});
