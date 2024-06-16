import React, { useState, Dispatch, SetStateAction } from 'react';
import { TextField, InputAdornment, Box, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import localStorageService from '@/services/LocalStorageService';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetUser } from '@/store/user/userSlice';

interface ILeftPanelProps {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    isSearchUser: boolean;
    setIsSearchUser: Dispatch<SetStateAction<boolean>>;
}

export default function LeftPanel({ search, setSearch, isSearchUser, setIsSearchUser }: ILeftPanelProps) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const iconStyle: React.CSSProperties = {
        fontSize: 30,
        cursor: 'pointer',
    }

    const [anchorEl, setAnchorEl] = useState<Element | null>(null);

    const handleMenuClick = (event: React.MouseEvent<SVGSVGElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        localStorageService.remove('Authorization');
        dispatch(resetUser());
        navigate('/login', {replace: true});
    };

    const handleArrowBackClick = () => {
        setIsSearchUser(false);
        setSearch('');
    };

    return (
        <Box style={{display: 'flex', alignItems: 'center', gap: 5}}>
            {isSearchUser ?
                <ArrowBackIcon style={iconStyle} onClick={handleArrowBackClick} /> :
                <MenuIcon style={iconStyle} onClick={handleMenuClick} />
            }
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
            </Menu>
            <TextField
                variant="outlined"
                onClick={() => setIsSearchUser(true)}
                placeholder="Поиск"
                autoComplete='off'
                fullWidth
                size='small'
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    style: {
                        borderRadius: '17px',
                    }
                }}
            />
        </Box>
    );
}
