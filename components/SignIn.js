import { signIn, signOut, useSession } from 'next-auth/client'

export default function SignIn({ children }) {
    const [session, loading] = useSession()

    if (!session) {
        return <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    }

    return <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>

        <main>{children}</main>
    </>
}
