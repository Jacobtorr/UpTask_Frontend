import { NoteFormData } from "@/types/index"
import { useForm } from "react-hook-form"
import ErrorMessage from "../ErrorMessage"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNote } from "@/api/NoteAPI"
import { toast } from "react-toastify"
import { useLocation, useParams } from "react-router-dom"

export default function AddNoteForm() {

    const initialValues : NoteFormData = { 
        content: '',
     }
     
     const { register, handleSubmit, reset, formState: {errors} } = useForm({defaultValues: initialValues})

     // Read the project
    const params = useParams()
    const projectId = params.projectId!

    // Read the id
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('viewTask')!

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
       mutationFn: createNote,
       onError: (error) => {
           toast.error(error.message)
       },
       onSuccess: (data) => {
           toast.success(data)
           reset()
           queryClient.invalidateQueries({queryKey: ['task', taskId]})
       }
    })

     const handleAddNote = (formData: NoteFormData) => {
        const data = {
            formData,
            projectId,
            taskId
        }
        mutate(data)
     }


  return (
    <form 
        action=""
        onSubmit={handleSubmit(handleAddNote)}
        className="space-y-3"
        noValidate
    >
        <div className="flex flex-col gap-2">
            <label htmlFor="content" className="font-bold">Create Note</label>

            <input 
                type="text" 
                placeholder="Note Content"
                className="w-full p-3 border border-gray-300 mb-5 rounded-lg"
                {...register('content', {
                    required: 'Note Content is required'
                })}
                name="content" 
                id="content" 
            />

            {errors.content && (
                <ErrorMessage>{errors.content?.message}</ErrorMessage>
            )}
        </div>

        <input type="submit" value="Create Note"  className="bg-fuchsia-600 hover:bg-fuchsia-700 p-2 w-full rounded-lg text-white uppercase font-black transition-all cursor-pointer" />
        
    </form>
  )
}