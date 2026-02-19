import { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactFlow, {
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Handle,
    Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

// --- Custom Nodes ---

const TriggerNode = ({ data }) => {
    return (
        <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500 w-40">
            <div className="font-bold text-center text-blue-900 text-sm">TRIGGER</div>
            <div className="text-xs text-gray-500 text-center mt-1">{data.label}</div>
            <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-blue-500" />
        </div>
    );
};

const ActionNode = ({ data }) => {
    return (
        <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-yellow-500 w-40">
            <Handle type="target" position={Position.Top} className="w-2 h-2 bg-yellow-500" />
            <div className="font-bold text-center text-yellow-900 text-sm">ACTION</div>
            <div className="text-xs text-gray-500 text-center mt-1">{data.label}</div>
            <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-yellow-500" />
        </div>
    );
};

const OutputNode = ({ data }) => {
    return (
        <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-500 w-40">
            <Handle type="target" position={Position.Top} className="w-2 h-2 bg-green-500" />
            <div className="font-bold text-center text-green-900 text-sm">OUTPUT</div>
            <div className="text-xs text-gray-500 text-center mt-1">{data.label}</div>
        </div>
    );
};


const Editor = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [isSaved, setIsSaved] = useState(false);
    const [workflowName, setWorkflowName] = useState('');

    const nodeTypes = useMemo(() => ({
        trigger: TriggerNode,
        action: ActionNode,
        output: OutputNode,
    }), []);

    const { data: workflow, isLoading, isError } = useQuery({
        queryKey: ['workflows'],
        queryFn: async () => {
            const response = await api.get('/workflows');
            return response.data;
        },
        select: (workflows) => workflows.find(w => w._id === id),
    });

    useEffect(() => {
        if (workflow?.data) {
            setWorkflowName(workflow.name);
            const flowData = workflow.data;
            setNodes(flowData.nodes || []);
            setEdges(flowData.edges || []);

            if ((!flowData.nodes || flowData.nodes.length === 0)) {
                setNodes([
                    {
                        id: '1',
                        type: 'trigger',
                        position: { x: 250, y: 5 },
                        data: { label: 'Start' }
                    }
                ]);
            }
        }
    }, [workflow]);

    const saveMutation = useMutation({
        mutationFn: async (payload) => {
            const response = await api.put(`/workflows/${id}`, payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['workflows']);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000); 
        },
    });

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        []
    );
    const handleSave = () => {
        saveMutation.mutate({
            name: workflowName,
            data: { nodes, edges }
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (isError || !workflow) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-red-600 bg-gray-50">
                <p className="text-lg font-semibold">Workflow not found or error loading.</p>
                <Link to="/" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Header */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10 relative">
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <input
                            type="text"
                            value={workflowName}
                            onChange={(e) => setWorkflowName(e.target.value)}
                            className="text-lg font-bold text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent px-1"
                        />
                        {/* <p className="text-xs text-gray-500">ID: {id}</p> */}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isSaved && (
                        <div className="flex items-center gap-1 text-green-600 animate-fade-in text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            Saved
                        </div>
                    )}
                    <div className="hidden md:flex gap-2 mr-4 border-r pr-4 border-gray-200">
                        <button
                            onClick={() => setNodes(nds => [...nds, {
                                id: `${nds.length + 1}`,
                                type: 'action',
                                position: { x: Math.random() * 400, y: Math.random() * 400 },
                                data: { label: 'New Action' }
                            }])}
                            className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium"
                        >
                            + Action
                        </button>
                        <button
                            onClick={() => setNodes(nds => [...nds, {
                                id: `${nds.length + 1}`,
                                type: 'output',
                                position: { x: Math.random() * 400, y: Math.random() * 400 },
                                data: { label: 'New Output' }
                            }])}
                            className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium"
                        >
                            + Output
                        </button>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saveMutation.isPending}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-white transition-all
                            ${saveMutation.isPending
                                ? 'bg-blue-400 cursor-not-allowed'
                                : isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                            }`}
                    >
                        {saveMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {saveMutation.isPending ? 'Saving...' : 'Save Workflow'}
                    </button>
                </div>
            </div>

            {/* React Flow Canvas */}
            <div className="flex-1 bg-gray-50 w-full h-full ">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                    className="bg-orange-50"
                >
                    <Controls />
                    <Background color="#aaa" gap={16} />
                </ReactFlow>
            </div>
        </div>
    );
};

export default Editor;
