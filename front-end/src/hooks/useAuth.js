import { useDispatch } from "react-redux";
import { setUser, loading } from "../reducers/userReducer";
import { useNavigate } from "react-router-dom";
import { setPlan } from "../reducers/PlanReducer";

const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const URL = import.meta.env.VITE_API_BASE_URL;
    
    const subscribe = async (data, path) => {
        try {
            const res = await fetch(URL + 'api/auth/' + path, {
                body: JSON.stringify(data),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const responseData = await res.json();
            
            if (!res.ok) {
                return { error: responseData.error || 'Something went wrong. Please try again.' };
            }
            
            return responseData;
        } catch (error) {
            console.error('Network error:', error);
            return { error: 'Network error. Please check your connection.' };
        }
    }

    const login = async (data) => {
        dispatch(loading({ loading: true }));
        const result = await subscribe(data, 'login');
        
        if (result.error) {
            dispatch(setUser({ user: null, loginError: result.error }));
            dispatch(loading({ loading: false }));
            return;
        }
        
        // Only set user if login was successful
        dispatch(setUser({ user: result.user, loginError: null }));
        dispatch(loading({ loading: false }));
        localStorage.setItem('user', JSON.stringify(result));
        localStorage.setItem('token', result.token);
        navigate("/");
    }
    
    const signUp = async (data) => {
        dispatch(loading({ loading: true }));
        const result = await subscribe(data, 'signup');
        
        if (result.error) {
            dispatch(setUser({ user: null, signupError: result.error }));
            dispatch(loading({ loading: false }));
            return;
        }
        
        // Only set user if signup was successful
        dispatch(setUser({ user: result.user, signupError: null }));
        dispatch(loading({ loading: false }));
        localStorage.setItem('user', JSON.stringify(result));
        localStorage.setItem('token', result.token);
        navigate("/");
    }

    const logout = () => {
        dispatch(setUser({ user: null, loginError: null, signupError: null }));
        navigate("/login");
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('plan');
        dispatch(setPlan({ plan: null }));
    }

    return { login, signUp, logout }
}

export default useAuth;