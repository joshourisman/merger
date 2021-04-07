import { useQuery, gql } from '@apollo/client'

const QUERY = gql`
query { 
    viewer {
      repositories(first: 100, ownerAffiliations: [OWNER]) {
        edges {
          node {
            id
            nameWithOwner
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

    const { viewer: { repositories: { edges: repos } } } = data;

    return <div>
        <h1>Repositories:</h1>
        <ul>
            {repos.map(({ node: { nameWithOwner: repo } }, index) => <li key={index}>{repo}</li>)}
        </ul>
    </div>
}