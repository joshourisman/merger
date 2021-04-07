import { signIn, signOut, useSession } from 'next-auth/client'
import { ApolloProvider } from '@apollo/client'

import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

export default function SignIn({ children }) {
    const [session, loading] = useSession()

    if (!session) {
        return <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    }

    const httpLink = createHttpLink({ uri: 'https://api.github.com/graphql' })

    const authLink = setContext(async (_, { headers }) => {
        const token = session.accessToken
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : '',
            }
        }
    });

    const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });

    return <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>

        <main>
            <ApolloProvider client={client}>
                {children}
            </ApolloProvider>
        </main>
    </>
}
