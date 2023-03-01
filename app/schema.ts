
import { gql } from "apollo-server-express"; 

const Schema = gql`
    type Account {
        id: ID!
        authtoken: String
        role: String
        seenContent: [number]
    }
    type Level {
        id: ID!
        title: String
        description: String
    }

    type Lesson {
        id: ID!
        title: String
        description: String
        content: [Content!]
    }

    union Content = TextContent | QuestionContent

    type TextContent {
        content: String
        image: String
    }

    type QuestionContent {
        question: String
        type: String
        possibleAnswer: [String]
    }

    type Query {
        getAllLevels: [Level]
        getLevel(id: Int): Level
    }

    type Mutation {
        addLevel(title: String, description: String): Level
    }
`

export default Schema;