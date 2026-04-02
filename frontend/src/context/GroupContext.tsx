import { createContext, useState } from "react";
import type { GroupMember, LoadingGroups } from "../types";
import { getUserGroupsService, createGroupService } from "../services/apiServices";

export interface GroupContextType {
    groups: GroupMember[] | null;
    getMyGroups: () => Promise<void>;
    loading: LoadingGroups;
    createGroup: (data: FormData) => Promise<void>;
}

export const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider = ({ children }: { children: React.ReactNode }) => {

    const [groups, setGroups] = useState<GroupMember[] | null>(null);
    const [loading, setLoading] = useState<LoadingGroups>({
        fetchLoading: false,
        createLoading: false,
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


    return (
        <GroupContext.Provider value={{ groups, getMyGroups, loading, createGroup }}>
            {children}
        </GroupContext.Provider>
    )
}