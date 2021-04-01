import { createContext, useContext, useEffect, useState } from 'react'
import Router from 'next/router'

import { firebase } from '@lib/firebase'
import { createUser } from '@lib/db'


type UseProvideAuth = ReturnType<typeof useProvideAuth>
export const AuthContext = createContext<UseProvideAuth>({} as UseProvideAuth)

export const AuthProvider = ({ children }) => {
    const auth = useProvideAuth()
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}


export const useAuth = () => {
    return useContext(AuthContext)
}

function useProvideAuth() {
    const [user, setUser] = useState<FormattedUser | null>(null)
    const [loading, setLoading] = useState(true)

    const handleUser = async (rawUser: firebase.User | null) => {
        if (rawUser) {
            const user = await formatUser(rawUser)
            const { token, ...userWithoutToken } = user

            createUser(user.uid, userWithoutToken)
            setUser(user)

            setLoading(false)
            return user
        } else {
            setUser(null)

            setLoading(false)
            return false
        }
    }

    const signinWithEmail = (email: string, password: string) => {
        setLoading(true)
        return firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                handleUser(response.user)
                Router.push('/sites')
            })
    }

    const signinWithGitHub = (redirect?: string) => {
        setLoading(true)
        return firebase
            .auth()
            .signInWithPopup(new firebase.auth.GithubAuthProvider())
            .then((response) => {
                handleUser(response.user)

                if (redirect) {
                    Router.push(redirect)
                }
            })
    }

    const signinWithGoogle = (redirect?: string) => {
        setLoading(true)
        return firebase
            .auth()
            .signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then((response) => {
                handleUser(response.user)

                if (redirect) {
                    Router.push(redirect)
                }
            })
    }

    const signout = () => {
        Router.push('/')

        return firebase
            .auth()
            .signOut()
            .then(() => handleUser(null))
    }

    useEffect(() => {
        const unsubscribe = firebase.auth().onIdTokenChanged(handleUser)

        return () => unsubscribe()
    }, [])

    return {
        user,
        loading,
        signinWithEmail,
        signinWithGitHub,
        signinWithGoogle,
        signout
    }
}

const getStripeRole = async (): Promise<string> => {
    await firebase.auth().currentUser.getIdToken(true)
    const decodedToken = await firebase.auth().currentUser.getIdTokenResult()

    return decodedToken.claims.stripeRole || 'free'
}


interface FormattedUser {
    uid: string
    email: string
    name: string
    provider: string
    photoUrl: string
    stripeRole: string
    token: string
}

const formatUser = async (user: firebase.User): Promise<FormattedUser> => {
    const token = await user.getIdToken()
    return {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        provider: user.providerData[0].providerId,
        photoUrl: user.photoURL,
        stripeRole: await getStripeRole(),
        token
    }
}
