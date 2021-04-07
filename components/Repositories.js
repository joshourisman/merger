import { useQuery, gql } from '@apollo/client'

const QUERY = gql`
query { 
    viewer {
      repositories(first: 100, ownerAffiliations: [OWNER]) {
          nodes {
            id
            nameWithOwner
            pullRequests(first: 100) {
              nodes {
                id
                title
              }
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

    const { viewer: { repositories: { nodes: repos } } } = data;

    return <div>
        <h1>Repositories:</h1>
        <ul>
            {repos.map(({ nameWithOwner: repo, pullRequests: { nodes: pullRequests } }, index) => {
                return <li key={index}>{repo} ({pullRequests.length})</li>
            })}
        </ul>
    </div>
}