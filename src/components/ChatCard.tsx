import React from 'react';
import { Box, Typography } from '@mui/material';

export interface IChatCardProps {
    id: number;
    chatName: string;
    usernames: string[];
    isSelected: boolean;
    onClick: (chatId: number) => void;
}

export default function ChatCard({ id, usernames, chatName, isSelected, onClick }: IChatCardProps) {
    const chatCardStyle: React.CSSProperties = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '8px',
        backgroundColor: isSelected ? '#afacac' : 'white',
        cursor: 'pointer',
        textAlign: 'center',
    }

    return (
        <Box
            sx={{
                ...chatCardStyle,
                '&:hover': {
                    ...(isSelected ? {} : { backgroundColor: '#e1e1e1' }),
                },
            }}
            onClick={() => onClick(id)}
        >
            <Typography>{usernames.length === 1 ? usernames[0] : chatName}</Typography>
        </Box>
    );
}
