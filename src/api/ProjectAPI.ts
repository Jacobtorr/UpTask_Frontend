import { dashboardProjectSchema, editProjectSchema, Project, ProjectFormData, projectSchema } from "@/types/index";
import api from "@/lib/axios";
import { isAxiosError } from "axios";

export async function createProject(formData: ProjectFormData) {
    try {
        const url = `/projects`
        const { data } = await api.post(url, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getAllProjects() {

    try {
        const url = '/projects'
        const { data } = await api(url)
        const response = dashboardProjectSchema.safeParse(data)
        
        // Si los datos estan mapeados correctamente retornamos los datos
        if(response.success) {
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getProjectById(id: Project['_id']) {
    try {
        const url = `/projects/${id}`
        const { data } = await api(url)
        const response = editProjectSchema.safeParse(data)
        if(response.success) {
            return response.data
        }
        
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getFullProject(id: Project['_id']) {
    try {
        const url = `/projects/${id}`
        const { data } = await api(url)
        const response = projectSchema.safeParse(data)
        if(response.success) {
            return response.data
        }
        
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}


type ProjectAPIType = {
    formData: ProjectFormData
    projectId: Project['_id']
}

export async function updateProject({formData, projectId} : ProjectAPIType) {
    try {
        const url = `/projects/${projectId}`
        const { data } = await api.put<string>(url, formData)
        return data
        
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteProject(id: Project['_id']) {
    try {
        const url = `/projects/${id}`
        const { data } = await api.delete<string>(url)
        return data
        
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}