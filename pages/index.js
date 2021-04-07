import Head from 'next/head'
import ClientOnly from '../components/ClientOnly'
import Repositories from '../components/Repositories'

export default function Home() {
  return <div>
    <Head>
      <title>Merger</title>
    </Head>
    <main>
      <ClientOnly>
        <Repositories />
      </ClientOnly>
    </main>
  </div>
}
