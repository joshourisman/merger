import { GraphQLClient, gql } from 'graphql-request'
import { useSession } from 'next-auth/client'
import useSWR from 'swr'
import Link from 'next/link'

const graphQLClient = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    authorization: `Bearer`
  }
})

const VIEWER_QUERY = gql`
query ViewerQuery($afterCursor: String) { 
  viewer {
    id
    avatarUrl
    repositories(first: 5, after: $afterCursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
      edges {
        node {
          id
          name
          owner {
            id
            login
          }
          nameWithOwner
          pullRequests(states: OPEN) {
            totalCount
          }
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

  let afterCursor;
  const { data, error } = useSWR([VIEWER_QUERY, afterCursor], (query, afterCursor) => graphQLClient.request(query, { afterCursor }));
  const loading = !data;


  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    console.log(error)
    return <p>error...</p>
  }

  const { viewer: { repositories: { totalCount, edges, pageInfo: { hasNextPage, endCursor } } } } = data;

  return <div>
    <h1>Repositories ({totalCount}):</h1>
    <ul>
      {edges.map(({ node: { nameWithOwner: repo, pullRequests: { totalCount } } }, index) => {
        return <li key={index}><Link href={repo}><a>{repo}</a></Link> ({totalCount})</li>
      })}
    </ul>
  </div>
}