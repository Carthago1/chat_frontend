import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/user/userSlice';
import httpService from '@/services/HttpService';
import localStorageService from '@/services/LocalStorageService';
import { IUser } from '@/common/types';
import ws from '@/socket/socket';

import LoginView from './LoginView';
import SignUpView from './SignUpView';
import HomeView from './HomeView';

export default function MainView() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserData = async() => {
            if (!localStorageService.get('Authorization')) {
                return;
            }

            const me = await httpService.get<IUser>('whoami');
            dispatch(setUser({...me}));
            ws.setup(me.id);
        }

        fetchUserData();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<LoginView />} />
                <Route path='/signup' element={<SignUpView />} />
                <Route path='/' element={<HomeView />} />
            </Routes>
        </BrowserRouter>
    );
}
