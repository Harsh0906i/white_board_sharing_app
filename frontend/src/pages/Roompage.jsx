import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import rough from 'roughjs';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

export default function Roompage() {
    const socket = io('https://white-board-sharing-app-n497.vercel.app', {
        transports: ['websocket', 'polling'], // Ensure correct transports
        withCredentials: true, // Necessary for cross-origin requests
    });
    const [tool, setTool] = useState("pencil");
    const [color, setColor] = useState("#000000");
    const [elements, setElements] = useState([]);
    const [history, setHistory] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const navigate = useNavigate();
    const ctxRef = useRef(null);
    const canvasRef = useRef(null);
    const params = useParams();
    const { host } = useSelector((state) => state.user1)

    function clearCanvas() {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setElements([]);
            setHistory([]);
        }
    }

    function undo() {
        setElements((prev) => {
            const lastElement = prev[prev.length - 1];
            if (lastElement) {
                setHistory((prevHistory) => [...prevHistory, lastElement]);
            }
            return prev.slice(0, prev.length - 1);
        });
    }

    function redo() {
        setHistory((prev) => {
            const lastHistoryElement = prev[prev.length - 1];
            if (lastHistoryElement) {
                setElements((prevElements) => [...prevElements, lastHistoryElement]);
                return prev.slice(0, prev.length - 1);
            }
            return prev;
        });
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctxRef.current = ctx;
            canvas.height = window.innerHeight * 0.8;
            canvas.width = window.innerWidth * 0.95;
        }
    }, []);

    useLayoutEffect(() => {
        if (canvasRef.current && ctxRef.current) {
            const roughCanvas = rough.canvas(canvasRef.current);
            const ctx = canvasRef.current.getContext('2d');

            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            elements.forEach((element) => {
                if (element.type === 'pencil') {
                    roughCanvas.linearPath(element.path, { stroke: element.stroke });
                } else if (element.type === 'line') {
                    roughCanvas.line(element.offsetX, element.offsetY, element.width, element.height, { stroke: element.stroke });
                } else if (element.type === 'rectangle') {
                    const width = element.width - element.offsetX;
                    const height = element.height - element.offsetY;
                    roughCanvas.rectangle(element.offsetX, element.offsetY, width, height, { stroke: element.stroke });
                }
            });
        }
    }, [elements]);

    useEffect(() => {
        const canvasImage = canvasRef.current.toDataURL();
        const canvas = canvasRef.current;
        socket.emit('roomInfo', params.id)
        socket.emit('whiteboardData', canvasImage, params.id);
        socket.on('whiteboardDataResponse', (data) => {
            setTimeout(() => {
                const image = new Image();
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                image.onload = function () {
                    ctx.drawImage(image, 0, 0);
                }
                image.src = data;
            }, 300);
        });

    }, [elements])

    function handleMouseMove(e) {
        const { offsetX, offsetY } = e.nativeEvent;

        if (drawing) {
            if (tool === 'pencil') {
                setElements((prevElements) => {
                    const lastElement = prevElements[prevElements.length - 1];
                    const newPath = [...lastElement.path, [offsetX, offsetY]];
                    const updatedElement = { ...lastElement, path: newPath };
                    socket.emit('draw', { element: updatedElement });
                    return [...prevElements.slice(0, -1), updatedElement];
                });
            } else if (tool === 'line' || tool === 'rectangle') {
                setElements((prevElements) => {
                    const lastElement = prevElements[prevElements.length - 1];
                    const updatedElement = { ...lastElement, width: offsetX, height: offsetY };
                    socket.emit('draw', { element: updatedElement });
                    return [...prevElements.slice(0, -1), updatedElement];
                });
            }
        }
    }

    function handleMouseDown(e) {
        const { offsetX, offsetY } = e.nativeEvent;
        setHistory([]);
        if (tool === 'pencil') {
            const newElement = {
                type: 'pencil',
                offsetX,
                offsetY,
                path: [[offsetX, offsetY]],
                stroke: color
            };
            setElements((prevElements) => [...prevElements, newElement]);
        } else if (tool === 'line') {
            const newElement = {
                type: 'line',
                offsetX,
                offsetY,
                width: offsetX,
                height: offsetY,
                stroke: color
            };
            setElements((prevElements) => [...prevElements, newElement]);
        } else if (tool === 'rectangle') {
            const newElement = {
                type: 'rectangle',
                offsetX,
                offsetY,
                width: offsetX,
                height: offsetY,
                stroke: color
            };
            setElements((prevElements) => [...prevElements, newElement]);
        }
        setDrawing(true);
    }

    function handleMouseUp() {
        setDrawing(false);
    }

    async function handleDismiss() {
        const res = await fetch('/api/auth/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: params.id })
        })
        const data = await res.json();
        if (data.success === true) {
            navigate('/');
        }
    }

    return (
        <>
            <div className='flex items-center justify-center flex-col p-3'>
                <h1 className='font-semibold text-lg border-b'>Real-time board sharing </h1>
                <div className='flex items-center justify-center'>
                    {host ?
                        <div className='flex items-center justify-center flex-col p-5'>
                            <div className='m-3 flex'>
                                <div className='mx-2'>
                                    <label>Pencil</label>
                                    <input type="radio" className='m-3' name='tool' value='pencil' checked={tool === 'pencil'} onChange={(e) => setTool(e.target.value)} />
                                </div>
                                <div className='mx-2'>
                                    <label>Line</label>
                                    <input type="radio" name='tool' className='m-3' value='line' onChange={(e) => setTool(e.target.value)} />
                                </div>
                                <div className='mx-2'>
                                    <label>Rectangle</label>
                                    <input type="radio" name='tool' className='m-3' value='rectangle' onChange={(e) => setTool(e.target.value)} />
                                </div>
                            </div>
                            <div className='flex flex-col items-center justify-center my-2'>
                                <label>Select color:</label>
                                <input className='hover:cursor-pointer' type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                            </div>
                            <div className='mx-3 p-3'>
                                <button onClick={undo} className='bg-slate-200 px-4 m-2 rounded-lg hover:opacity-80 disabled:opacity-80' disabled={elements.length === 0}>Undo</button>
                                <button onClick={redo} className='bg-slate-200 px-4 rounded-lg m-2 hover:opacity-80 disabled:opacity-80' disabled={history.length < 1}>Redo</button>
                                <button onClick={clearCanvas} disabled={elements.length === 0} className='bg-red-600 rounded-lg px-5 m-2 hover:opacity-80 text-white disabled:opacity-80'>Clear canvas</button>
                            </div>
                        </div> : <button onClick={clearCanvas} className='bg-red-600 rounded-lg px-5 m-2 hover:opacity-80 text-white disabled:opacity-80'>Clear canvas</button>
                    }
                </div>
                {
                    host ?
                        <div className='shadow-md overflow-hidden'>
                            <canvas className='bg-slate-300' onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} ref={canvasRef}></canvas>
                        </div> :
                        <div className='shadow-md overflow-hidden'>
                            <canvas className='bg-slate-300' ref={canvasRef}></canvas>
                        </div>
                }

                <div>
                    {
                        host ?
                            <button className='bg-red-600 text-white py-1 rounded-lg px-4 mt-2 m-2 shadow-md hover:opacity-90' onClick={handleDismiss}>Dismiss</button>
                            :
                            <button className='bg-red-600 text-white py-1 rounded-lg px-4 mt-2 m-2 shadow-md hover:opacity-90' onClick={() => navigate('/')} >Leave</button>
                    }
                </div>
            </div>
        </>
    );
}