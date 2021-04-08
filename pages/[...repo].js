import { useRouter } from 'next/router'
import Head from 'next/head'
import { GraphQLClient, gql } from 'graphql-request'
import useSWR from 'swr'
import { useSession } from 'next-auth/client'

const REPO_QUERY = gql`
query Repo($login: String!, $name: String!) { 
  repositoryOwner(login: $login) {
    repository(name: $name) {
      id
      nameWithOwner
      pullRequests(first: 100, states: OPEN) {
        totalCount
        nodes {
          id
          number
          title
          permalink
        }
      }
    }
  }
}
`;

const Repository = () => {
  const [session] = useSession()
  const graphQLClient = new GraphQLClient('https://api.github.com/graphql', {
    headers: {
      authorization: `Bearer ${session.accessToken}`
    }
  });
  const router = useRouter()
  const { query: { repo: [login, name] } } = router
  const { data, error } = useSWR([REPO_QUERY, login, name], (query, login, name) => graphQLClient.request(query, { login, name }));
  const loading = !data;


  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    console.log(error)
    return <p>error...</p>
  }

  console.log(data)
  const { repositoryOwner: { repository: { nameWithOwner, pullRequests } } } = data;

  return <div>
    <Head><title>{nameWithOwner}</title></Head>
    <main>
      <h1>{nameWithOwner}</h1>
      <ul>
        {pullRequests.nodes.map(({ title, permalink, number }, index) => <li key={index}>
          <a href={permalink} target="_blank">{number}. {title}</a>
        </li>)}
      </ul>
    </main>
  </div>
}

export default Repository