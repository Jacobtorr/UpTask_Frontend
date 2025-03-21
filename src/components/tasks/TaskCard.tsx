// React
import { Fragment } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
// Dependencies
import { toast } from "react-toastify"
import { Menu, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon, EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid"
import { useDraggable } from '@dnd-kit/core'
// API & Types
import { deleteTask } from "@/api/TaskAPI"
import { TaskProject } from "@/types/index"

type TaskCardProps = {
    task: TaskProject
    canEdit: boolean
}

export default function TaskCard({task, canEdit} : TaskCardProps) {

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task._id
    })
    const navigate = useNavigate()
    // Obtener el ProjectId
    const params = useParams()
    const projectId = params.projectId!

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
      mutationFn: deleteTask,
      onError: (error) => {
        toast.error(error.message)
      },
      onSuccess: (data) => {
        toast.success(data)
        //Refresh cache data before deleting
        queryClient.invalidateQueries({queryKey: ['project', projectId]})
      }
    })

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
    } : undefined

  return (
    
    <li 
    {...listeners} {...attributes}  ref={setNodeRef} style={style}
    className="p-5 bg-white border border-slate-300 flex justify-between gap-3 rounded-lg">
        <div 
  
         className="min-w-0 flex flex-col gap-y-4">
            <button
                type="button"
                className="text-xl font-bold text-slate-600 text-left"
                onClick={() => navigate(location.pathname + `?viewTask=${task._id}`)}
            >
                {task.name}
            </button>

            <p className="text-slate-500">{task.description}</p>
        </div>

        <div className="flex shrink-0  gap-x-6">
            <Menu as="div" className="relative flex-none">
                <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">opciones</span>
                    <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                </Menu.Button>
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                    <Menu.Items
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <Menu.Item>
                            <button 
                                type='button' 
                                className='flex gap-2 items-center px-3 py-1 text-sm leading-6 text-gray-900 hover:text-gray-500'
                                onClick={() => navigate(location.pathname + `?viewTask=${task._id}`)}
                            >
                                <EyeIcon className="h-4 w-4"/>
                                 Ver Tarea
                            </button>
                        </Menu.Item>

                        {canEdit && (
                            <>
                                <Menu.Item>
                                    <button 
                                        type='button' 
                                        className='flex gap-2 items-center px-3 py-1 text-sm leading-6 text-gray-900 hover:text-gray-500'
                                        onClick={() => navigate(location.pathname + `?editTask=${task._id}`)}
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        Editar Tarea
                                    </button>
                                </Menu.Item>

                                <Menu.Item>
                                    <button 
                                        type='button' 
                                        className='flex gap-2 items-center px-3 py-1 text-sm leading-6 text-red-500 hover:text-red-300'
                                        onClick={() => mutate({projectId, taskId: task._id})}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        Eliminar Tarea
                                    </button>
                                </Menu.Item>
                            </>
                        )}
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    </li>
  )
}