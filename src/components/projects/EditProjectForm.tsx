// Dependencies
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
// Components
import ProjectForm from "./ProjectForm";
// API & Types
import { updateProject } from "@/api/ProjectAPI";
import { Project, ProjectFormData } from "@/types/index";

type EditProjectFormProps = {
    data: ProjectFormData
    projectId: Project['_id']
}

export default function EditProjectForm({data, projectId} : EditProjectFormProps) {

    const navigate = useNavigate()
    const { register, handleSubmit, formState: {errors} } = useForm({defaultValues: {
        projectName: data.projectName,
        clientName: data.clientName,
        description: data.description
    }})

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: updateProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            //Refresh cache data before editing
            queryClient.invalidateQueries({queryKey: ['projects']})
            queryClient.invalidateQueries({queryKey: ['editProject', projectId]})

            toast.success(data)
            navigate('/')
        }
    })

    const handleForm = async (formData: ProjectFormData) => {
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }

  return (
    <>
        <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-black">Edit Project</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">Fill the following form to edit a project</p>


            <nav className="my-6">
                <Link
                    className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-all rounded-lg"
                    to='/'
                >
                
                Return to Projects
                </Link>
            </nav>
        
            <form 
                className="mt-10 bg-white shadow-lg rounded-lg p-10"
                onSubmit={handleSubmit(handleForm)}
                noValidate
            >

                <ProjectForm 
                    register={register}
                    errors={errors}
                />

                <input 
                    type="submit" 
                    value="Edit Project" 
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 p-3 rounded-lg text-white uppercase font-bold w-full transition-all cursor-pointer"
                />
            </form>
        </div>
    </>
  )
}