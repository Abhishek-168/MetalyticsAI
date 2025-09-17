import os
import json
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Model setup
model = genai.GenerativeModel('gemini-1.5-flash-latest')

# Load knowledge base
with open('knowledge_base.txt', 'r') as f:
    general_knowledge = f.read()

# Load input2.json data
try:
    with open('../../../DB/input2.json', 'r') as f:
        project_data = json.load(f)
    print("Successfully loaded input2.json data")
except FileNotFoundError:
    print("Warning: input2.json not found, using empty data")
    project_data = {}

# Create comprehensive knowledge base from JSON data
def create_comprehensive_knowledge_base():
    knowledge_parts = [general_knowledge, "\n\n--- PROJECT DATA ---\n"]
    
    if 'projects' in project_data and project_data['projects']:
        project = project_data['projects'][0]  # Get first project
        
        knowledge_parts.append(f"\n**Current Project Details:**")
        knowledge_parts.append(f"- Project Name: {project.get('projectName', 'N/A')}")
        knowledge_parts.append(f"- Metal Type: {project.get('metalType', 'N/A')}")
        knowledge_parts.append(f"- Goal: {project.get('goal', 'N/A')}")
        knowledge_parts.append(f"- System Boundary: {project.get('systemBoundary', 'N/A')}")
        knowledge_parts.append(f"- Functional Unit: {project.get('functionalUnit', 'N/A')}")
        
        # Add environmental impact results
        if 'results' in project_data and project_data['results']:
            results = project_data['results'][0]
            env_impact = results.get('environmentalImpact', {}).get('core', {})
            
            knowledge_parts.append(f"\n**Environmental Impact Results:**")
            knowledge_parts.append(f"- Global Warming Potential: {env_impact.get('globalWarmingPotential_kg_CO2_eq', 'N/A')} kg CO2 eq")
            knowledge_parts.append(f"- Acidification Potential: {env_impact.get('acidificationPotential_kg_SO2_eq', 'N/A')} kg SO2 eq")
            knowledge_parts.append(f"- Eutrophication Potential: {env_impact.get('eutrophicationPotential_kg_PO4_eq', 'N/A')} kg PO4 eq")
            knowledge_parts.append(f"- Water Footprint: {env_impact.get('waterFootprint_L', 'N/A')} L")
            knowledge_parts.append(f"- Energy Demand: {env_impact.get('cumulativeEnergyDemand_MJ', 'N/A')} MJ")
            
            # Add circularity data
            circularity = results.get('circularity', {})
            metrics = circularity.get('metrics', {})
            
            knowledge_parts.append(f"\n**Circularity Metrics:**")
            knowledge_parts.append(f"- Circularity Score: {metrics.get('circularityScore_percent', 'N/A')}%")
            knowledge_parts.append(f"- Recycled Content: {metrics.get('recycledContent_percent', 'N/A')}%")
            knowledge_parts.append(f"- Material Recovery Rate: {metrics.get('materialRecoveryRate_percent', 'N/A')}%")
            knowledge_parts.append(f"- Landfill Rate: {metrics.get('landfillRate_percent', 'N/A')}%")
            
    # Add process data
    if 'extractions' in project_data:
        knowledge_parts.append(f"\n**Extraction Process Data:**")
        for extraction in project_data['extractions']:
            knowledge_parts.append(f"- Metal: {extraction.get('metal', 'N/A')}")
            knowledge_parts.append(f"- Material Grade: {extraction.get('materialGrade', 'N/A')}")
            knowledge_parts.append(f"- Region: {extraction.get('region', 'N/A')}")
            knowledge_parts.append(f"- Method: {extraction.get('method', 'N/A')}")
            knowledge_parts.append(f"- Energy Consumption: {extraction.get('totalEnergyConsumption_kWh_perTon', 'N/A')} kWh/ton")
            knowledge_parts.append(f"- Water Usage: {extraction.get('waterUsage_L_perTon', 'N/A')} L/ton")
            
    if 'smeltings' in project_data:
        knowledge_parts.append(f"\n**Smelting Process Data:**")
        for smelting in project_data['smeltings']:
            knowledge_parts.append(f"- Technology: {smelting.get('smeltingTech', 'N/A')}")
            knowledge_parts.append(f"- Operating Temperature: {smelting.get('operatingTemp_C', 'N/A')}°C")
            knowledge_parts.append(f"- Energy Consumption: {smelting.get('energyConsumption_kWh_perTon', 'N/A')} kWh/ton")
            knowledge_parts.append(f"- Output Efficiency: {smelting.get('outputEfficiency_percent', 'N/A')}%")
            
    return "\n".join(knowledge_parts)

# Create the comprehensive knowledge base
comprehensive_knowledge = create_comprehensive_knowledge_base()

# Flask setup
app = Flask(__name__)
CORS(app)

# --- Home Route (renders frontend) ---
@app.route('/')
def home():
    return render_template('index.html')

# --- Chat API ---
@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    prompt_template = f"""
    ---
    **Your Role and Rules:**
    1. You are a specialized, expert chatbot for the "AI-Driven Life Cycle Assessment (LCA) Tool for Metallurgy and Mining".
    2. Your ONLY source of information is the "COMPREHENSIVE KNOWLEDGE BASE" provided below.
    3. You can answer questions about the specific project data, environmental impacts, circularity metrics, and process details.
    4. If a user asks about topics outside the scope of this LCA tool and project data, you MUST politely decline.
    5. Your refusal message should be something like: "I apologize, but my expertise is limited to the LCA tool for metallurgy and mining and the current project data. I cannot answer questions about [topic]."
    6. Use the specific project data to provide detailed, accurate answers about environmental impacts, circularity, and process information.

    **COMPREHENSIVE KNOWLEDGE BASE:**
    {comprehensive_knowledge}
    ---

    **User's Question:**
    "{user_message}"

    **Your Answer:**
    """

    try:
        response = model.generate_content(prompt_template)
        bot_response = response.text
        return jsonify({'reply': bot_response})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to generate response'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
