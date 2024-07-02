import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkHost } from '../redux/userSlice';

const socket = io('https://white-board-sharing-app-n497.vercel.app');

export default function Forms() {
    const { currentUser } = useSelector((state) => state.user1);
    const [id, setId] = useState('');
    const [joinload, setjoinload] = useState(false);
    const [createload, setcreateload] = useState(false);
    const [joinid, setjoinId] = useState('');
    const [name, setName] = useState('');
    const [joinname, setjoinName] = useState('');
    const [item, setitem] = useState();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { host } = useSelector((state) => state.user1);
    const dispatch = useDispatch();

    function createUuid() {
        const uuid = uuidv4();
        setId(uuid);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const data = {
            name,
            roomid: id,
            presenter: true,
            host: true,
        };
        setUser(data);
        setcreateload(true)
        const res = await fetch('/api/user/host', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const D = await res.json();
        if (D.success === true) {
            setcreateload(false)
            dispatch(checkHost(true));
            navigate(`/${data.roomid}`);
        }
        setcreateload(false)
    }

    async function handlejoinSubmit(e) {
        e.preventDefault();
        const data = {
            joinname,
            joinid,
            presenter: false,
            host: false,
        };
        setjoinload(true)
        const res = await fetch('/api/user/student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const D = await res.json();
        setitem(D);
        if (D.success === true) {
            setjoinload(false)
            dispatch(checkHost(false));
            navigate(`/${data.joinid}`);
        }
        setjoinload(false)
    }

    useEffect(() => {
        setName(currentUser?.name);
        setjoinName(currentUser?.name);
    }, [currentUser]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setitem('');
        }, 2500);

        return () => clearTimeout(timer);
    }, [item]);

    return (
        <div className='sm:flex items-center h-screen p-3'>
            <div className='border mx-auto p-3 gap-2 flex items-center flex-col py-3 shadow-md'>
                <h1 className='font-semibold border-b border-gray-300'>Join Room</h1>
                <form onSubmit={handlejoinSubmit}>
                    <div className='flex flex-col p-3 border-b  border-gray-300'>
                        <input
                            required
                            type="text"
                            value={joinname}
                            onChange={(e) => setjoinName(e.target.value)}
                            placeholder='Enter your name...'
                            className='p-3 m-1 border-none outline-none bg-slate-100 rounded-lg'
                        />
                        <input
                            required
                            type="text"
                            value={joinid}
                            onChange={(e) => setjoinId(e.target.value)}
                            placeholder='Enter room code...'
                            className='p-3 m-1 border-none outline-none bg-slate-100 rounded-lg'
                        />
                        {
                            currentUser ?
                                <button type="submit" className='rounded-lg bg-slate-500 text-white px-3 p-1 pr-2 pl-2 hover:opacity-90'>
                                    {joinload ? 'Joining...' : 'Join'}
                                </button> :
                                <Link className='flex items-center justify-center bg-gray-600 py-1 text-white rounded-lg cursor-pointer w-full' to={'/signup'}>Signin</Link>
                        }
                    </div>
                </form>
                <div className='text-red-600'>{item?.success === false && <p>{item.message}</p>}</div>
            </div>
            <div className='border mx-auto p-3 gap-2 flex items-center flex-col shadow-md'>
                <h1 className='font-semibold border-b border-gray-300'>Create Room</h1>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col p-3 border-b border-gray-300'>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Enter your name...'
                            className='p-3 m-1 border-none outline-none bg-slate-100 rounded-lg'
                        />
                        <div className='p-3'>
                            <input
                                required
                                type="text"
                                value={id}
                                readOnly
                                placeholder='Generate room code...'
                                className='p-3 m-1 border-none hover:cursor-default outline-none bg-slate-100 rounded-lg text-gray-500'
                            />
                            <button
                                type="button"
                                className='m-2 rounded-lg bg-red-600 text-white px-3 py-1 hover:opacity-80'
                                onClick={createUuid}
                            >
                                Generate
                            </button>
                            <button
                                type="button"
                                className='rounded-lg bg-blue-600 text-white px-3 py-1 hover:opacity-80'
                                disabled={id.length === 0}
                                onClick={() => navigator.clipboard.writeText(id)}
                            >
                                Copy
                            </button>
                        </div>
                        {
                            currentUser ?
                                <button type="submit" className='rounded-lg bg-slate-500 text-white px-3 p-1 pr-2 pl-2 hover:opacity-90'>
                                    {createload ? 'Creating...' : 'Create'}
                                </button> :
                                <Link className='flex items-center justify-center bg-gray-600 py-1 text-white rounded-lg cursor-pointer w-full' to={'/signup'}>Signin</Link>
                        }
                    </div>
                </form>
            </div>
        </div>
    );
}
