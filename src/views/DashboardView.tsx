// Dependencies
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useQuery} from "@tanstack/react-query"
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon, EyeIcon, PencilIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/20/solid'
// API
import {  getAllProjects } from "@/api/ProjectAPI"
import { useAuth } from "@/hooks/useAuth"
import { isManager } from "@/utils/policies"
import DeleteProjectModal from "@/components/projects/DeleteProjectModal"

export default function DashboardView() {

  const location = useLocation()
  const navigate = useNavigate()
  const { data: user, isLoading: authLoading } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getAllProjects,
  })

 

  if(isLoading && authLoading) return 'Cargando...'
  if(data && user) return (
    <>
        <h1 className="text-5xl font-black">My Projects</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Manage your Projects</p>


        <nav className="my-6 flex">

            <Link
                className="flex items-center gap-2 bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-all rounded-lg"
                to='/projects/create'
            >
            <PlusCircleIcon className="h-6 w-6" />
            
            New Project
            </Link>
        </nav>

        {data.length ? (
          <ul role="list" className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg">
            {data.map((project) => (
              <li key={project._id} className="flex justify-between gap-x-6 px-5 py-10">
                  <div className="flex min-w-0 gap-x-4">
                      <div className="min-w-0 flex-auto space-y-2">
                        <div className="mb-2">

                          { isManager(project.manager, user._id) ?

                          <p className="font-bold text-xs uppercase bg-indigo-50 text-indigo-500 border-2 border-indigo-500 rounded-lg inline-block py-1 px-5">
                            Owner
                          </p> : 

                          <p className="font-bold text-xs uppercase bg-green-50 text-green-500 border-2 border-green-500 rounded-lg inline-block py-1 px-5">Member</p>
                          
                          }

                        </div>
                          <Link to={`/projects/${project._id}`}
                              className="text-gray-600 cursor-pointer hover:text-gray-400 text-3xl font-bold transition-all"
                          >{project.projectName}</Link>
                          <p className="text-sm text-gray-400">
                              Cliente: {project.clientName}
                          </p>
                          <p className="text-sm text-gray-400">
                              {project.description}
                          </p>
                      </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-x-6">
                      <Menu as="div" className="relative flex-none">
                          <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                              <span className="sr-only">opciones</span>
                              <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                          </Menu.Button>
                          <Transition as={Fragment} enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95">
                              <Menu.Items
                                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                              >
                                      <Menu.Item>
                                          <Link to={`/projects/${project._id}`}
                                              className='px-3 py-1 text-sm leading-6 text-gray-900 flex gap-2 items-center hover:text-gray-500'>
                                          <EyeIcon 
                                            className="h-4 w-4"
                                          />  View Project
                                          </Link>
                                      </Menu.Item>

                                      {isManager(project.manager, user._id) && (
                                        <>
                                          <Menu.Item>
                                              <Link to={`/projects/${project._id}/edit`}
                                                  className='px-3 py-1 text-sm leading-6 text-gray-900 flex gap-2 items-center hover:text-gray-500'>
                                              <PencilIcon 
                                                className="h-4 w-4"
                                              />  Edit Project
                                              </Link>
                                          </Menu.Item>
                                          <Menu.Item>
                                              <button 
                                                  type='button' 
                                                  className='flex px-3 py-1 text-sm leading-6 text-red-500 gap-2 items-center hover:text-red-300'
                                                  onClick={() => navigate(location.pathname + `?deleteProject=${project._id}`) }
                                              >
                                                <TrashIcon 
                                                  className="h-4 w-4"
                                                />
                                                  Delete Project
                                              </button>
                                          </Menu.Item>
                                        </>
                                      )}

                              </Menu.Items>
                          </Transition>
                      </Menu>
                  </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-20">
            There's not Projects yet {''}
            <Link
              to='/projects/create'
              className=" text-fuchsia-500 font-bold hover:text-fuchsia-600 transition-all"
            >Create Project</Link>
          </p>
        )}

        <DeleteProjectModal />
    </>
  )
}