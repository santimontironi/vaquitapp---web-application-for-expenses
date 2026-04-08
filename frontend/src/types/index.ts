// ============================================================
// AUTH
// ============================================================

export interface User {
    _id: string;
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
    user: User;
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
}

export interface CreateGroupData {
    name: string;
    description: string;
    image: FileList
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

// ============================================================
// PROPS AND COMPONENTS
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

export interface SideNavGroupProps {
    itemSelected: GroupDashboardView;
    setSelectedItem: (item: GroupDashboardView) => void;
}

export interface MemberItemProps {
    member: Members;
    onDeleteMember: (userId: string) => void;
}

export type GroupDashboardView = "members" | "add-member" | "view-plans";

export interface AllMembersProps {
    members: Members[] | null;
    onDeleteMember: (userId: string) => void;
}

