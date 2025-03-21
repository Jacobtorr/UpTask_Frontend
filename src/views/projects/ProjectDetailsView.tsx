import { getFullProject } from "@/api/ProjectAPI";
import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { PlusCircleIcon, ArrowLeftCircleIcon, UsersIcon } from '@heroicons/react/20/solid'
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskList from "@/components/tasks/TaskList";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policies";
import { useMemo } from "react";

export default function ProjectDetailsView() {

    const { data: user, isLoading: authLoading } = useAuth()
    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!

    const { data, isLoading, isError } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => getFullProject(projectId),
        retry: false
    })

    const canEdit = useMemo(() => data?.manager === user?._id , [data, user])

    if(isLoading && authLoading) return 'Cargando...'
    if(isError) return <Navigate to='/404' />
    if(data && user) return (
   <>
     <h1 className="text-5xl font-black">{data.projectName}</h1>
     <p className="text-2xl font-light text-gray-500 mt-10">{data.description}</p>


        <nav className="my-6 flex justify-between">
        {isManager(data.manager, user._id) && (

            <div className="flex gap-3 items-center">
            <button
                className="bg-purple-400 hover:bg-purple-500 px-5 py-3 text-white text-xl font-bold cursor-pointer transition-all rounded-lg flex items-center gap-2"
                onClick={() => navigate(location.pathname + '?newTask=true')}
            >
               <PlusCircleIcon 
                className="h-6 w-6"
               /> Add Task
            </button>

            <Link
                to={'team'}
                className="bg-fuchsia-600 hover:bg-fuchsia-700 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-all rounded-lg flex items-center gap-2"
            >
            <UsersIcon 
                className="h-6 w-6"
               /> Team
            
            </Link>

            </div>
        )}


            <Link
                className="bg-purple-400 hover:bg-purple-500 px-5 py-3 text-white text-xl font-bold cursor-pointer transition-all rounded-lg flex items-center gap-2"
                to='/'
            >
            <ArrowLeftCircleIcon 
                className="h-6 w-6"
            />
            Return to projects
            </Link>
        </nav>

        {/* ADD NEW TASK COMPONENT */}
        <AddTaskModal />

        {/* SHOW TASKS COMPONENT */}
        <TaskList 
            tasks={data.tasks}
            canEdit={canEdit}
        />

        {/* EDIT TASK COMPONENT */}
        <EditTaskData />

        {/* VIEW TASK COMPONENT */}
        <TaskModalDetails />
   </>
  )
}