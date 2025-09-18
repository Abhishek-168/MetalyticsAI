

import express from "express";
import { LCAProject } from "../../DB/schemas/project";
import { Results } from "../../DB/schemas/results";

const router = express.Router();


router.get('/envimpact/:projectId', async (req, res) => {
  // try {
  //   const projectId = req.params.projectId;
  //   if (!projectId) {
  //     return res.status(400).json({ error: "Project ID is required" });
  //   }
  

  //   const project = await LCAProject.findById(projectId);
  //   if (!project) {
  //     return res.status(404).json({ error: "Project not found" });
  //   }
  //   if (!project.results || !project.results.resultId) {
  //     return res.status(404).json({ error: "Results not found for this project" });
  //   }
    const resultId = "68cafd4d7ad4c74eef07bf12";

    // Assuming Results is another model you have defined
    const results = await Results.findById(resultId);
    if (!results) {
      return res.status(404).json({ error: "Results not found" });
    }
    res.status(200).json({ environmentalImpact: results.environmentalImpact });
  }
// catch (error) {
//     console.error('Error retrieving environmental impact:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }
)

router.get('/circularity/:projectId', async (req, res) => {
  // try {
  //   const projectId = req.params.projectId;
  //   if (!projectId) {
  //     return res.status(400).json({ error: "Project ID is required" });
  //   }

  //   const project = await LCAProject.findById(projectId);
  //   if (!project) {
  //     return res.status(404).json({ error: "Project not found" });
  //   }
  //   if (!project.results || !project.results.resultId) {
  //     return res.status(404).json({ error: "Results not found for this project" });
  //   }
    const resultId = "68cafd4d7ad4c74eef07bf12";

    const results = await Results.findById(resultId);
    if (!results) {
      return res.status(404).json({ error: "Results not found" });
    }
    res.status(200).json({ circularity: results.circularity });
  // } catch (error) {
  //   console.error('Error retrieving circularity:', error);
  //   res.status(500).json({ error: 'Internal server error' });
  // }
})

export default router;
