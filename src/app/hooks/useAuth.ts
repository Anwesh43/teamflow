import { useEffect, useState } from "react";
import { authHelper } from "../lib/appwrite";


const authHelperClosure = authHelper()

const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(null)
    useEffect(() => {
        authHelperClosure.getCurrentUser().then((user) => {
            setCurrentUser(user)
        })
    }, [])
    return {
        currentUser
    }
};

export default useAuth;