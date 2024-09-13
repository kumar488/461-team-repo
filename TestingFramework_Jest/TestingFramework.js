// Generic test function to test if TestingFramework.js is working correctly
// If this doesn't work correctly, then you did something wrong setting up the framework.
// DO NOT REMOVE



// Description of the following function example:
// This function takes two numbers and returns their sum, very simple.
// The sum function is located in the TestingFramework.js file. The TestingFramework.test.js file will import this function and test it.
function sum(a, b) {
    return a + b;
}
// Export the sum function so it can be imported and tested in the TestingFramework.test.js file.
module.exports = sum;



// To test user made functions, insert them below in the TestingFramework.js file. [This is that file!]