import { useRouter } from 'next/router'
import Head from 'next/head'
import { useQuery, gql } from '@apollo/client'

const QUERY = gql`
query Repo($name: String!) { 
  viewer {
    repository(name: $name) {
      pullRequests(first: 100, states: OPEN) {
        totalCount
      }
    }
  }
}
`;

const Repository = () => {
  const router = useRouter()
  const { query: { repo: [user, repo] } } = router
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      name: repo
    }
  });
  console.log(data)

  return <div>
    <Head><title>{user}/{repo}</title></Head>
    <main>{user}/{repo}</main>
  </div>
}

export default Repository