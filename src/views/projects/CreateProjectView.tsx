// Dependencies
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
// Components
import ProjectForm from "@/components/projects/ProjectForm"
// Types / API's
import { ProjectFormData } from "@/types/index"
import { createProject } from "@/api/ProjectAPI"
import { ArrowLeftCircleIcon } from "@heroicons/react/20/solid"

export default function CreateProjectView() {

    const navigate = useNavigate()
    const initialValues : ProjectFormData = {
        projectName: "",
        clientName: "",
        description: ""
    }

    const { register, handleSubmit, formState: {errors} } = useForm({defaultValues: initialValues})

    const { mutate } = useMutation({
        mutationFn: createProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            navigate('/')
        }
    })
    
    const handleForm = async (formData : ProjectFormData) => mutate(formData)
    

  return (
    <>
        <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-black">Create Project</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">Fill the following form to create a project</p>


            <nav className="flex my-6">
                <Link
                    className="flex items-center gap-2 bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-all rounded-lg"
                    to='/'
                >
                <ArrowLeftCircleIcon className="h-6 w-6" />
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
                    value="Create Project" 
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 p-3 rounded-lg text-white uppercase font-bold w-full transition-all cursor-pointer"
                />
            </form>
        </div>
    </>
  )
}