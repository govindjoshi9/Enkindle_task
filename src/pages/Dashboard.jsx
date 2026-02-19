import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, LogOut, FileText, Loader2 } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';

const Dashboard = () => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const queryClient = useQueryClient();

    // Fetch Workflows
    const { data: workflows, isLoading, isError, error } = useQuery({
        queryKey: ['workflows'],
        queryFn: async () => {
            const response = await api.get('/workflows');
            return response.data;
        },
    });

    // Create Workflow Mutation
    const createMutation = useMutation({
        mutationFn: async () => {
            // Default payload as requested
            const newWorkflow = {
                name: "Untitled Workflow",
                data: { nodes: [], edges: [] }
            };
            const response = await api.post('/workflows', newWorkflow);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['workflows']);
            // Optional: Navigate to editor immediately
            navigate(`/editor/${data._id}`);
        },
    });

    // Delete Workflow Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/workflows/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['workflows']);
        },
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCreate = () => {
        createMutation.mutate();
    };

    const handleDelete = (id, e) => {
        e.preventDefault(); // Prevent link navigation if inside a link (though here it's separate)
        if (window.confirm('Are you sure you want to delete this workflow?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-red-600">
                <p>Error loading workflows: {error.message}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-blue-600" />
                        My Workflows
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Actions Bar */}
                <div className="flex justify-end mb-6">
                    <button
                        onClick={handleCreate}
                        disabled={createMutation.isPending}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {createMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}
                        Create New Workflow
                    </button>
                </div>

                {/* Workflow Grid */}
                {workflows?.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">No workflows found. Create one to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workflows.map((workflow) => (
                            <div
                                key={workflow._id}
                                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between h-48"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 truncate" title={workflow.name}>
                                        {workflow.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Created: {new Date(workflow.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <Link
                                        to={`/editor/${workflow._id}`}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        Open Editor &rarr;
                                    </Link>
                                    <button
                                        onClick={(e) => handleDelete(workflow._id, e)}
                                        className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                        title="Delete Workflow"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
