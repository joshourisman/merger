import { useQuery, gql } from '@apollo/client'
import Link from 'next/link'

const QUERY = gql`
query { 
  viewer {
    repositories(first: 100, ownerAffiliations: [OWNER]) {
      totalCount
      nodes {
        id
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
  const { data, loading, error } = useQuery(QUERY);

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