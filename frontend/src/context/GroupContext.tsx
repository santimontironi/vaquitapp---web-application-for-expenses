import { createContext, useEffect, useState } from "react";
import type { GroupMember, LoadingGroups, Group, Members, AddMemberData, EditGroupData } from "../types/groups.types";
import { getUserGroupsService, createGroupService, getGroupDetailsService, getGroupMembersService, inviteMemberService, acceptInvitationService, deleteMemberService, getAdminRoleService, leaveGroupService, editGroupService } from "../services/groups.service";

export interface GroupContextType {
    groups: GroupMember[] | null;
    members: Members[] | null;
    groupById: Group | null;
    getMyGroups: () => Promise<void>;
    loading: LoadingGroups;
    createGroup: (data: FormData) => Promise<void>;
    editGroup: (idGroup: string, data: EditGroupData) => Promise<void>;
    getGroupById: (idGroup: string) => Promise<void>;
    getMembersByGroup: (idGroup: string) => Promise<void>;
    inviteMember: (idGroup: string, data: AddMemberData) => Promise<void>;
    acceptInvitation: (token: string) => Promise<void>;
    deleteMember: (idGroup: string, idUser: string) => Promise<void>;
    getAdminRole: (idGroup: string, userId: string) => Promise<void>;
    leaveGroup: (idGroup: string) => Promise<void>;
}

export const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider = ({ children }: { children: React.ReactNode }) => {

    const [groups, setGroups] = useState<GroupMember[] | null>(null);
    const [groupById, setGroupById] = useState<Group | null>(null);
    const [members, setMembers] = useState<Members[] | null>(null);
    const [loading, setLoading] = useState<LoadingGroups>({
        fetchLoading: false,
        createLoading: false,
        invitationLoading: false,
        editLoading: false,
    });

    useEffect(() => {
        getMyGroups();
    }, []);

    async function getMyGroups() {
        setLoading(prev => ({ ...prev, fetchLoading: true }));
        try{
            const response = await getUserGroupsService();
            setGroups(response.data.groups);
        }
        catch(error){
            console.error("Error al obtener los grupos:", error);
        }
        finally {
            setLoading(prev => ({ ...prev, fetchLoading: false }));
        }
    }

    async function createGroup (data: FormData) {
        setLoading(prev => ({ ...prev, createLoading: true }));
        try {
            await createGroupService(data);
            await getMyGroups();
        } catch (error) {
            console.error("Error al crear el grupo:", error);
            throw error;
        }
        finally {
            setLoading(prev => ({ ...prev, createLoading: false }));
        }
    }

    async function editGroup(idGroup: string, data: EditGroupData) {
        setLoading(prev => ({ ...prev, editLoading: true }));
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            if (data.image && data.image.length > 0) {
                formData.append('image', data.image[0]);
            }
            await editGroupService(idGroup, formData);
            await getMyGroups();
        } catch (error) {
            console.error("Error al editar el grupo:", error);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, editLoading: false }));
        }
    }

    async function getGroupById(idGroup: string) {
        setLoading(prev => ({ ...prev, fetchLoading: true }));
        try {
            const response = await getGroupDetailsService(idGroup);
            setGroupById(response.data.group);
        } catch (error) {
            console.error("Error al obtener los detalles del grupo:", error);
        }
        finally {
            setLoading(prev => ({ ...prev, fetchLoading: false }));
        }
    }

    async function getMembersByGroup(idGroup: string) {
        try{
            const response = await getGroupMembersService(idGroup);
            setMembers(response.data.members);
        }
        catch(error){
            console.error("Error al obtener los miembros del grupo:", error);
            throw error
        }
    }

    async function inviteMember(idGroup: string, data: AddMemberData) {
        try {
            await inviteMemberService(idGroup, data);
        } catch (error) {
            console.error("Error al invitar al miembro:", error);
            throw error;
        }
    }

    async function acceptInvitation(token: string) {
        setLoading(prev => ({ ...prev, invitationLoading: true }));
        try {
            await acceptInvitationService(token);
        } catch (error) {
            console.error("Error al aceptar la invitación:", error);
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, invitationLoading: false }));
        }
    }

    async function deleteMember(idGroup: string, idUser: string) {
        try {
            await deleteMemberService(idGroup, idUser);
            setMembers(prev => prev ? prev.filter(member => member.user._id !== idUser) : null);
        } catch (error) {
            console.error("Error al eliminar al miembro del grupo:", error);
            throw error;
        }
    }

    async function leaveGroup(idGroup: string) {
        try {
            await leaveGroupService(idGroup);
            await getMyGroups();
        } catch (error) {
            console.error("Error al abandonar el grupo:", error);
            throw error;
        }
    }

    async function getAdminRole(idGroup: string, userId: string) {
        try {
            await getAdminRoleService(idGroup, userId);    
        } catch (error) {
            console.error("Error al obtener el rol de administrador:", error);
            throw error;
        }
    }

    return (
        <GroupContext.Provider value={{ groups, getMyGroups, loading, createGroup, editGroup, groupById, getGroupById, members, getMembersByGroup, inviteMember, acceptInvitation, deleteMember, getAdminRole, leaveGroup }}>
            {children}
        </GroupContext.Provider>
    )
}