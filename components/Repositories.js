import { GraphQLClient, gql } from 'graphql-request'
import { useSession } from 'next-auth/client'
import { useSWRInfinite } from 'swr'
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
    repositories(first: 100, after: $afterCursor) {
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

  const { data, error, size, setSize } = useSWRInfinite((pageIndex, previousPageData) => {
    if (pageIndex === 0) return [VIEWER_QUERY, null];
    const { viewer: { repositories: { pageInfo: { hasNextPage, endCursor } } } } = previousPageData;
    if (hasNextPage) return [VIEWER_QUERY, endCursor];
    return null
  }, (query, afterCursor) => graphQLClient.request(query, { afterCursor }));
  const loading = !data;


  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    console.log(error)
    return <p>error...</p>
  }

  if (data.length === size && data[data.length - 1].viewer.repositories.pageInfo.hasNextPage) setSize(size + 1);

  return <div>
    <h1>Repositories ({data[0].viewer.repositories.totalCount}):</h1>
    <ul>
      {data.map((page) => page.viewer.repositories.edges.map(({ node: { nameWithOwner: repo, pullRequests: { totalCount } } }, index) => {
        return <li key={index}><Link href={repo}><a>{repo}</a></Link> ({totalCount})</li>
      }))}
    </ul>
  </div>
}