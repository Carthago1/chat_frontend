import React from 'react';
import { Box, Typography } from '@mui/material';

interface IUserCardProps {
    id: number;
    username: string;
    onClick: (chatId: number) => void;
}

export default function UserCard({id, username, onClick}: IUserCardProps) {
    const userCardStyle: React.CSSProperties = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '8px',
        cursor: 'pointer',
        textAlign: 'center',
    }

    return (
        <Box
            sx={{
                ...userCardStyle,
                '&:hover': {
                    backgroundColor: '#e1e1e1',
                },
            }}
            onClick={() => onClick(id)}
        >
            <Typography>{username}</Typography>
        </Box>
    );
}
