import NextAuth from 'next-auth';
import Providers from 'next-auth/providers'

export default NextAuth({
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            scope: ['user,public_repo,repo,repo_deployment,repo:status,read:repo_hook,read:org,read:public_key,read:gpg_key']
        }),
    ],
    callbacks: {
        async jwt(token, user, account, profile, isNewUser) {
            if (account?.accessToken) {
                token.accessToken = account.accessToken;
            }
            return token
        },
        async session(session, token) {
            session.accessToken = token.accessToken
            return session
        }
    }
})