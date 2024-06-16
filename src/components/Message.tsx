import React from 'react';
import { Box, Typography } from '@mui/material';

interface IMessageProps {
    userId?: number;
    authorId: number;
    content: string;
    sentAt: Date;
}

export default function Message({ userId, authorId, content, sentAt }: IMessageProps) {
    const date = new Date(sentAt);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return (
        <Box style={{display: 'flex', justifyContent: `flex-${userId === authorId ? 'end' : 'start'}`, marginBottom: 5}}>
            <Box style={{backgroundColor: userId === authorId ? '#a2ffa8' : '#bdbaba',
                            position: 'relative',
                            width: 'fit-content',
                            padding: '10px 20px',
                            borderRadius: 10,
                        }}>
                <Typography>{content}</Typography>
                <Typography style={{ fontSize: '10px', position: 'absolute', bottom: 1, right: 2, color: 'gray' }}>
                    {`${hours}:${minutes}`}
                </Typography>
            </Box>
        </Box>
    );
}
