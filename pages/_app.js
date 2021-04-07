import 'tailwindcss/tailwind.css'
import { Provider } from 'next-auth/client'
import SignIn from '../components/SignIn'

function MyApp({ Component, pageProps }) {
  return <Provider session={pageProps.session}>
    <SignIn>
      <Component {...pageProps} />
    </SignIn>
  </Provider>
}

export default MyApp
