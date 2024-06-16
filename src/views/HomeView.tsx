import React, { useEffect, useState, useRef } from 'react';
import { Grid, Box, Container, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import httpService from '@/services/HttpService';
import { IChat, IMessage, IUser } from '@/common/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import eventBus from '@/utils/EventBus';

import ChatCard from '@/components/ChatCard';
import LeftPanel from '@/components/LeftPanel';
import Message from '@/components/Message';
import InputMessageBar from '@/components/InputMessageBar';
import UserCard from '@/components/UserCard';

const scrollbarStyle = {
    'scrollbarWidth': 'none' as 'none',
    'WebkitScrollbar': {
      'display': 'none'
    }
};

export default function HomeView() {
    const { user } = useSelector((store: RootState) => store.user);
    const [chats, setChats] = useState<IChat[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [search, setSearch] = useState('');
    const [isSearchUser, setIsSearchUser] = useState(false);
    const [searchResult, setSearchResult] = useState<IUser[]>([]);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const isSubscribed = useRef(false);
    const bottomChatRef = useRef<HTMLDivElement | null>(null);
    const selectedChatIdRef = useRef(selectedChatId);
    const inputMessageRef = useRef('');

    const debounce = (func: () => void, delay: number) => {
        if (timer) {
            clearTimeout(timer);
        }

        setTimer(setTimeout(func, delay));
    };

    const processChatClick = (chatId: number) => {
        setSelectedChatId(chatId);
    };

    const scrollChatBottom = () => {
        if (bottomChatRef.current) {
            bottomChatRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
        }
    };

    const handleAddMessage = async (content: string, chatId: number | null) => {
        if (!chatId) {
            return;
        }

        try {
            const newMessage = await httpService.post<IMessage>('messages', {
                chatId,
                content,
            });
            setMessages(prev => [...prev, newMessage]);
            setInputMessage('');

            scrollChatBottom();
        } catch (error) {
            console.log(error);
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleAddMessage(inputMessageRef.current, selectedChatIdRef.current);
        } else if (event.key === 'Escape') {
            setIsSearchUser(false);
            setSearch('');
        }
    };

    const handleUserClick = (userId: number) => {
        let isExists: boolean = false;

        chats.forEach(chat => {
            if (!chat.chatName && chat.otherUserIds[0] === userId) {
                isExists = true;
                setSelectedChatId(chat.id);
                setIsSearchUser(false);
                setSearch('');
            } 
        });

        if (isExists) {
            return;
        }

        try {
            (async () => {
                const createdChat = await httpService.post<IChat>('chats', {
                    otherUserId: userId,
                });
                setChats(prev => [createdChat, ...prev]);
                setSelectedChatId(createdChat.id);
                setIsSearchUser(false);
                setSearch('');
            })();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        inputMessageRef.current = inputMessage;
    }, [inputMessage]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const receivedChats = await httpService.get<IChat[]>('chats');
                setChats(receivedChats);
            } catch (error) {
                console.log(error);
            }
        }

        if (!isSubscribed.current) {
            eventBus.subscribe('newMessage', (message) => {
                if (message.chatId === selectedChatIdRef.current) {
                    setMessages(prevMessages => [...prevMessages, message]);
                    scrollChatBottom();
                }
            });
            isSubscribed.current = true;
        }

        fetchChats();

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        debounce(async () => {
            try {
                if (search) {
                    const searchResults = await httpService.get<IUser[]>(`search?username=${search}`);
                    setSearchResult(searchResults);
                }
            } catch (error) {
                console.log(error);
            }
        }, 300);

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        }
    }, [search]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const receivedMessages = await httpService.get<IMessage[]>(`messages?chat_id=${selectedChatId}`);

                setMessages(receivedMessages);
            } catch (error) {
                console.log(error);
            }
        }
        
        if (selectedChatId) {
            fetchMessages();
        }

        selectedChatIdRef.current = selectedChatId;
    }, [selectedChatId]);

    useEffect(() => {
        scrollChatBottom();
    }, [messages]);

    return (
        <Grid container style={{height: '100vh'}}>
            <Grid item xs={4}>
                <Container>
                    <LeftPanel
                        search={search}
                        setSearch={setSearch}
                        isSearchUser={isSearchUser}
                        setIsSearchUser={setIsSearchUser}
                    />

                    <Stack style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 40px)', ...scrollbarStyle, marginTop: 5 }}>
                        {isSearchUser ?
                            searchResult.map(user => (
                                <UserCard {...user} key={user.id} onClick={handleUserClick} />
                            ))
                            :
                            chats.map(chat => (
                                <ChatCard 
                                    key={chat.id}
                                    id={chat.id}
                                    usernames={chat.otherUsernames}
                                    isSelected={chat.id === selectedChatId}
                                    chatName={chat.chatName}
                                    onClick={processChatClick}
                                />
                            ))
                        }
                    </Stack>
                </Container>
            </Grid>

            <Grid item xs={8}>
                <Container style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <Box style={{ flexGrow: 1, overflowY: 'auto', ...scrollbarStyle, maxHeight: 'calc(100vh - 50px)' }}>
                        {messages.map(message => (
                            <Message
                                key={message.id}
                                userId={user?.id}
                                authorId={message.userId}
                                content={message.content}
                                sentAt={message.sentAt}
                            />
                        ))}
                        <div style={{height: 20}} ref={bottomChatRef} />
                    </Box>
                    
                    {selectedChatId &&
                        <Box style={{display: 'flex', justifyContent: 'center'}}>
                            <InputMessageBar input={inputMessage} setInput={setInputMessage} />
                            <SendIcon 
                                style={{fontSize: 40, cursor: 'pointer'}}
                                onClick={() => handleAddMessage(inputMessage, selectedChatId)} />
                        </Box>
                    }
                </Container>
            </Grid>
        </Grid>
    );
}
