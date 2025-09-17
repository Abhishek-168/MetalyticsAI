import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"

interface Project {
    _id: string;
    projectName: string;
    metalType: string;
    goal: string;
    systemBoundary: string;
    meta: {
        status: string;
        createdAt: string;
    };
}

export default function Landing() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('https://metalyticsai-2.onrender.com//api/project/all');
            setProjects(response.data.projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Draft':
                return 'bg-gray-100 text-gray-800';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800';
            case 'Completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return <>
        <div className="flex flex-col items-center">
            <span className="text-6xl mt-[100px] pb-[2rem]"> Metalytics AI </span>
            <span className="text-4xl text-gray-700 pb-[2rem]"> An AI-powered platform for Life Cycle Assessment (LCA) </span>
            <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800" 
            onClick={() => navigate('/project/initialise')}
            > Get Started </button>

            {/* Previous Projects Section */}
            <div className="w-full max-w-6xl mt-16 px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Previous Projects</h2>
                
                {loading ? (
                    <div className="text-center text-gray-600">Loading projects...</div>
                ) : projects.length === 0 ? (
                    <div className="text-center text-gray-600">No projects found. Start your first LCA project!</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div key={project._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900 truncate">{project.projectName}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.meta.status)}`}>
                                        {project.meta.status}
                                    </span>
                                </div>
                                
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div>
                                        <span className="font-medium">Metal:</span> {project.metalType}
                                    </div>
                                    <div>
                                        <span className="font-medium">Boundary:</span> {project.systemBoundary}
                                    </div>
                                    <div>
                                        <span className="font-medium">Created:</span> {formatDate(project.meta.createdAt)}
                                    </div>
                                </div>
                                
                                <div className="mt-4">
                                    <p className="text-sm text-gray-700 line-clamp-2">{project.goal}</p>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <button 
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                                        onClick={() => navigate(`/input/${project._id}`)}
                                    >
                                        Continue Project
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </>
}