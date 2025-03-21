import { deleteNote } from "@/api/NoteAPI"
import { useAuth } from "@/hooks/useAuth"
import { Note } from "@/types/index"
import { formatDate } from "@/utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type NoteDetailProps = {
    note: Note
}

export default function NoteDetail({note} : NoteDetailProps) {

    const { data, isLoading } = useAuth()
    const canDelete = useMemo(() => data?._id === note.createdBy._id, [data])

    // Read the project
    const params = useParams()
    const projectId = params.projectId!

    // Read the id
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('viewTask')!

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
        }
    })



if(isLoading) return 'Cargando...'
return (
    <div className="p-3 flex justify-between items-center">
        <div className="">
            <p>{note.content} by: <span className="font-bold">{note.createdBy.name}</span></p>

            <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>

        </div>

        {canDelete && (
            <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold px-5 text-xs py-2 rounded-lg cursor-pointer transition-all"
                onClick={() => mutate({projectId, taskId, noteId: note._id})}
            >
                DELETE
            </button>
        )}
    </div>
  )
}