import { createContext } from 'react';
import { login,logout,register } from '../services/authService';
import { useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { useService } from '../hooks/useService';
import { authServiceFactory } from '../services/authService';

export const AuthContext = createContext();

// const AuthContext = createContext();

export const AuthProvider = ({
    children
}) => {
    const [auth, setAuth] = useLocalStorage('auth', {})
    // const authService = authServiceFactory(auth.accessToken);
    const authService = authServiceFactory(auth.accessToken)
    const navigate = useNavigate()

    const onLoginSubmit = async (data) => {

        //  console.log(data.email);
        try {
            const result = await authService.login(data.email,data.password);

            setAuth(result);

            navigate('/catalog');
        } catch (error) {
            alert('incorrect Email or Password')
            // console.log('There is a problem');
        }
        // 1. Before useForm Hook,to try if it works
        // e.preventDefault();
        // console.log(Object.fromEntries((new FormData(e.target))));

    }
    const onRegisterSubmit = async (data) => {
    //   console.log(data);
        const { confirmPass, ...registerData } = data;
        if (confirmPass !== registerData.password) {
            alert('Password and Repaet Password don\'t match!');
            return;
        }
        try {
            // console.log(data);
            const result = await authService.register(data.email,data.password,data.firstName,data.lastName)
            // console.log(result);
            setAuth(result);
            // console.log(auth);
            navigate('/catalog');
        } catch (error) {
            alert('problem')
        }
    };

    const onLogout = async () => {
        await authService.logout(auth.accessToken)
        setAuth({})
    };
    const onFormClose = () => {
        navigate('/');
    };

    let authContextData = {
        onLoginSubmit,
        onRegisterSubmit,
        onLogout,
        onFormClose,
        userId: auth._id,
        firstName:auth.firstName,
        lastName:auth.lastName,
        token: auth.accessToken,
        userEmail: auth.email,
        isAuthenticated: !!auth.accessToken,
    };
     
    return (
        <>
            <AuthContext.Provider value={authContextData}>
                {children}
            </AuthContext.Provider>
        </>
    )
}
