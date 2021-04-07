import { useRouter } from 'next/router'
import Head from 'next/head'
import { useQuery, gql } from '@apollo/client'

const QUERY = gql`
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
  const router = useRouter()
  const { query: { repo: [login, name] } } = router
  const { data, loading, error } = useQuery(QUERY, {
    variables: { login, name }
  });

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