import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { Project, TeamMember, TeamMemberForm, teamMembersSchema } from "../types";


type TeamAPI = {
    id: TeamMember['_id']
    formData: TeamMemberForm
    projectId: Project['_id']
}

export async function findMemberByEmail({formData, projectId} : Pick<TeamAPI, 'formData' | 'projectId'>) {
    try {
        const url = `/projects/${projectId}/team/find`
        const { data } = await api.post(url, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function addMemberById({id, projectId} : Pick<TeamAPI, 'id' | 'projectId'>) {
    try {
        const url = `/projects/${projectId}/team`
        const { data } = await api.post(url, {id})
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getProjectTeam(projectId : Project['_id']) {
    try {
        const url = `/projects/${projectId}/team`
        const { data } = await api(url)
        const response = teamMembersSchema.safeParse(data)
        if(response.success) {
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function removeUserFromProject({id, projectId} : Pick<TeamAPI, 'id' | 'projectId'>) {
    try {
        const url = `/projects/${projectId}/team/${id}`
        const { data } = await api.delete<string>(url)
       return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}