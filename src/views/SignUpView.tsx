import React, { useState } from 'react';
import { Container, Grid, TextField, Button, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '@/store/user/userSlice';
import httpService from '@/services/HttpService';
import localStorageService from '@/services/LocalStorageService';

interface IGetTokenResponse {
    token: string;
}

interface IGetMe {
    id: number;
    username: string;
}

export default function SignUpView() {
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [repeatedPasswordError, setRepeatedPasswordError] = useState('');
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

        if (!repeatedPassword) {
            setRepeatedPasswordError('Повторите пароль');
            return;
        }

        if (password !== repeatedPassword) {
            setRepeatedPasswordError('Пароль не совпадает с предыдущим');
            return;
        }

        try {
            const body = {
                username,
                password,
            }
            await httpService.post<IGetTokenResponse>('/auth/register', body);

            const { token } = await httpService.post<IGetTokenResponse>('/auth/login', body);
            
            localStorageService.set('Authorization', token);

            const me = await httpService.get<IGetMe>('whoami');
            dispatch(setUser({...me}));

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

    function handleRepeatedPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setRepeatedPassword(e.target.value);
        setRepeatedPasswordError('');
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
                        <TextField
                            label="Повторите пароль"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={repeatedPassword}
                            onChange={handleRepeatedPasswordChange}
                            error={!!repeatedPasswordError}
                            helperText={repeatedPasswordError}
                        />
                        <Button variant="contained" color="primary" fullWidth type="submit">
                            Зарегистрироваться
                        </Button>
                        <Typography 
                            align="right" 
                            style={{ marginTop: '10px', cursor: 'pointer', fontSize: '0.85 em' }}
                            onClick={() => navigate('/login')}
                        >
                            Войти
                        </Typography>
                    </form>
                </Grid>
            </Grid>
        </Container>
    )
}
