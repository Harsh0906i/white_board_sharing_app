import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import app from '../firebase/firebase'
import { useDispatch } from "react-redux"
import { signInSuccess } from '../redux/userSlice'
import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function Oauth() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setloading] = useState(false)
    async function HandleGoogle() {
        try {
            setloading(true);
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
            const res = await fetch("/api/auth/google", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL })
            })
            const data = await res.json();
            setloading(false)
            dispatch(signInSuccess(data));
            navigate('/')
        } catch (error) {
            setloading(false)
            console.log(error)
        }
    }
    return (
        <div className="flex items-center justify-center h-screen">
            <button
                onClick={HandleGoogle}
                type="button"
                className="bg-gray-700 text-white p-3 shadow-lg rounded-lg uppercase hover:opacity-95 disabled:opacity-85"
                disabled={loading}
            >
                {loading ? 'Loading...' : 'continue with google'}
            </button>
        </div>

    )
}
