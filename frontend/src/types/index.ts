// ============================================================
// AUTH
// ============================================================

export interface User {
    id: string;
    username: string;
    email: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface LoginData {
    identifier: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    user: User;
}

export interface LoadingAuth {
    loginLoading: boolean;
    registerLoading: boolean;
    dashboardLoading?: boolean;
    confirmLoading?: boolean;
}

export interface DashboardResponse {
    user: User;
}

// ============================================================
// GROUPS
// ============================================================

export interface Group {
    id: string;
    name: string;
    image: string | null;
    description: string;
    created_by: User;
    created_at: Date;
}

export interface GroupMember {
    id: string;
    group: Group;
    user: User;
    role: "admin" | "member";
    joined_at: Date;
}

export interface GroupMemberResponse {
    groups: GroupMember[];
}

export interface LoadingGroups {
    fetchLoading: boolean;
    createLoading: boolean
}

export interface CreateGroupData {
    name: string;
    description: string;
    image: FileList
}

export interface CreateGroupResponse {
    groupCreated: Group;
}

// ============================================================
// PROPS
// ============================================================

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