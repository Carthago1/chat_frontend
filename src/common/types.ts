export interface IUser {
    id: number;
    username: string;
}

export interface IChat {
    id: number;
    joinDate: Date;
    chatName: string;
    otherUserIds: number[];
    otherUsernames: string[];
    otherUserJoinDates: Date[]; 
}

export interface IMessage {
    id: number;
    userId: number;
    username: string;
    content: string;
    sentAt: Date;
}
