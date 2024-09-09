//Main Function File

//Handle Input URL File

//Read urls in loop

//Per URL Operations (within loop)
//1. get github repo name and owner (strings)
//      -NOTE: this function will likely need to be async for handleURL.ts
//2. pass repo name and owner into metric scoring functions
//      -only the functions that will use the Github Rest/GraphQL API
//3. metric scoring will return values
//4. calculate net score of package
//5. print output (to CLI)
