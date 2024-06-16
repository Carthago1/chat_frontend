import React, { Dispatch, SetStateAction } from 'react';
import { Box, TextField } from '@mui/material';

interface IInputMessageBarProps {
    input: string;
    setInput: Dispatch<SetStateAction<string>>;
}

export default function InputMessageBar({ input, setInput }: IInputMessageBarProps) {
    return (
        <Box style={{ marginBottom: '10px', width: '100%' }}>
            <TextField
                variant="outlined"
                placeholder="Сообщение"
                autoComplete="off"
                fullWidth
                size="small"
                value={input}
                onChange={e => setInput(e.target.value)}
            />
        </Box>
    );
}
