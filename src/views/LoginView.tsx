import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, TextField, Button, Typography } from '@mui/material';
import httpService from '@/services/HttpService';
import localStorageService from '@/services/LocalStorageService';
import ws from '@/socket/socket';

import { IUser } from '@/common/types';

interface IGetTokenResponse {
    token: string;
}

export default function LoginView() {
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!username) {
            setUsernameError('Введите имя пользователя');
            return;
        }

        if (!password) {
            setPasswordError('Введите пароль');
            return;
        }

        try {
            const body = {
                username,
                password,
            }
            const { token } = await httpService.post<IGetTokenResponse>('/auth/login', body);
            
            localStorageService.set('Authorization', token);

            const me = await httpService.get<IUser>('whoami');
            dispatch(setUser({...me}));
            ws.setup(me.id);

            navigate('/');
        } catch (e) {
            console.log(e);
        }
    }

    function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value);
        setUsernameError('');
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
        setPasswordError('');
    }

    return (
        <Container>
            <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
                <Grid item xs={12} sm={6}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Имя пользователя"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={handleUsernameChange}
                            error={!!usernameError}
                            helperText={usernameError} 
                        />
                        <TextField
                            label="Пароль"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={handlePasswordChange}
                            error={!!passwordError}
                            helperText={passwordError}
                        />
                        <Button variant="contained" color="primary" fullWidth type="submit">
                            Войти
                        </Button>
                        <Typography 
                            align="right" 
                            style={{ marginTop: '10px', cursor: 'pointer', fontSize: '0.85 em' }}
                            onClick={() => navigate('/signup')}
                        >
                            Зарегистрироваться
                        </Typography>
                    </form>
                </Grid>
            </Grid>
        </Container>
    );
}
