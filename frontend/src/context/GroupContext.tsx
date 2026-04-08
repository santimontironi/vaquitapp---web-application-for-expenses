import { createContext, useState } from "react";
import type { GroupMember, LoadingGroups, Group, Members, AddMemberData } from "../types";
import { getUserGroupsService, createGroupService, getGroupDetailsService, getGroupMembersService, inviteMemberService, acceptInvitationService, deleteMemberService } from "../services/apiServices";

export interface GroupContextType {
    groups: GroupMember[] | null;
    members: Members[] | null;
    groupById: Group | null;
    getMyGroups: () => Promise<void>;
    loading: LoadingGroups;
    createGroup: (data: FormData) => Promise<void>;
    getGroupById: (idGroup: string) => Promise<void>;
    getMembersByGroup: (idGroup: string) => Promise<void>;
    inviteMember: (idGroup: string, data: AddMemberData) => Promise<void>;
    acceptInvitation: (token: string) => Promise<void>;
    deleteMember: (idGroup: string, idUser: string) => Promise<void>;
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
    });

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


    return (
        <GroupContext.Provider value={{ groups, getMyGroups, loading, createGroup, groupById, getGroupById, members, getMembersByGroup, inviteMember, acceptInvitation, deleteMember }}>
            {children}
        </GroupContext.Provider>
    )
}