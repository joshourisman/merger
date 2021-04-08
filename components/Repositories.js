import { GraphQLClient, gql } from 'graphql-request'
import { useSession } from 'next-auth/client'
import useSWR from 'swr'
import Link from 'next/link'

const graphQLClient = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    authorization: `Bearer`
  }
})

const QUERY = gql`
query { 
  viewer {
    id
    avatarUrl
    repositories(first: 100, ownerAffiliations: [OWNER]) {
      totalCount
      nodes {
        id
        name
        owner {
          id
          login
        }
        nameWithOwner
        pullRequests(first: 100, states: OPEN) {
          totalCount
        }
      }
    }
  }
}
`;

export default function Repositories() {
  const [session] = useSession();
  const graphQLClient = new GraphQLClient('https://api.github.com/graphql', {
    headers: {
      authorization: `Bearer ${session.accessToken}`
    }
  });

  const { data, error } = useSWR(QUERY, (query) => graphQLClient.request(query));
  const loading = !data;


  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    console.log(error)
    return <p>error...</p>
  }

  const { viewer: { repositories: { totalCount, nodes: repos } } } = data;

  return <div>
    <h1>Repositories ({totalCount}):</h1>
    <ul>
      {repos.map(({ nameWithOwner: repo, pullRequests: { totalCount } }, index) => {
        return <li key={index}><Link href={repo}><a>{repo}</a></Link> ({totalCount})</li>
      })}
    </ul>
  </div>
}