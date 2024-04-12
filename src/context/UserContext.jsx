import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem('The Kul-est Token'));

    useEffect(()=>{
        const fetchUser = async () => {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            };

            const respone = await fetch('/users', requestOptions);

            if (!respone.ok) {
                setToken(null);
            }
            localStorage.setItem('The Kul-est Token', token)
        };

        fetchUser();
    }, [token]);

        return (
            <UserContext.Provider value={[token, setToken]}>
                {props.children}
            </UserContext.Provider>
        )
};

