// Dependencies
import { Navigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
// Components
import EditProjectForm from "@/components/projects/EditProjectForm"
// API
import { getProjectById } from "@/api/ProjectAPI"

export default function EditProjectView() {

    const params = useParams()
    const projectId = params.projectId!

    
    const { data, isLoading, isError } = useQuery({
        queryKey: ['editProject', projectId],
        queryFn: () => getProjectById(projectId),
        retry: false
    })

    if(isLoading) return 'Cargando...'
    if(isError) return <Navigate to='/404' />

  if(data) return <EditProjectForm data={data} projectId={projectId} />
}