import levels from "./dataset"; 

const Resolvers = {

  Query: {
    getAllLevels: () => levels,

    getLevel: (_: any, args: any) => { 
      console.log(args);
      return levels.find((level) => level.id === args.id);
    },

  },
  Mutation: {

    addLevel: (_: any, args: any) => {
      const newLevel = {
        id: levels.length + 1, 
        title: args.title,
        description: args.description,
      };
      levels.push(newLevel);
      return newLevel; 
    },

  },
};

export default Resolvers;