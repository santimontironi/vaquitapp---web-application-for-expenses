import type { User } from "./auth.types";

export interface Group {
    _id: string;
    name: string;
    image: string | null;
    description: string;
    created_by: User;
    created_at: Date;
}

export interface GroupMember {
    _id: string;
    group: Group;
    user: string;
    role: "admin" | "member";
    joined_at: Date;
}

export interface GroupMemberResponse {
    groups: GroupMember[];
}

export interface LoadingGroups {
    fetchLoading: boolean;
    createLoading: boolean;
    invitationLoading: boolean;
    editLoading: boolean;
}

export interface CreateGroupData {
    name: string;
    description: string;
    image: FileList;
}

export interface CreateGroupResponse {
    groupCreated: Group;
}

export interface GroupDetailsResponse {
    group: Group;
}

export interface Members {
    _id: string;
    group: string;
    user: User;
    role: "admin" | "member";
    joined_at: Date;
}

export interface MembersResponse {
    members: Members[];
}

export interface AddMemberData {
    email: string;
    role: "admin" | "member";
}

export type GroupDashboardView = "members" | "add-member" | "view-plans" | "create-plan";


export interface HeaderDashboardProps {
    user: User;
}

export interface MyGroupsProps {
    myGroups: GroupMember[];
    loading: LoadingGroups;
}

export interface MyGroupCardProps {
    myGroup: GroupMember;
}

export interface SideNavGroupProps {
    itemSelected: GroupDashboardView;
    setSelectedItem: (item: GroupDashboardView) => void;
    groupId: string;
}

export interface MemberItemProps {
    member: Members;
    onDeleteMember: () => void;
    onGrantAdmin: () => void;
    isAdmin: boolean;
}

export interface AllMembersProps {
    idGroup: string;
}

export interface EditGroupData {
    name: string;
    description: string;
    image?: FileList;
}

export interface EditGroupResponse {
    groupEdited: Group;
}

export interface EditGroupModalProps {
    group: Group;
    onClose: () => void;
}