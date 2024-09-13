// Generic test function to test if TestingFramework.js is working correctly
// If this doesn't work correctly, then you did something wrong setting up the framework.
// DO NOT REMOVE


// Description of the following function example:
// This line imports the sum function from the TestingFramework.js file.
const sum = require('./TestingFramework.js');

// This is a test case for the sum function. It tests if the sum function works correctly.
// The test case will pass if the sum function returns the correct value.
// The test case will fail if the sum function returns the incorrect value, throws and error, or does not return a value.

// Explanation of the test function:
// The test function takes two arguments, a string and a function.
// String: The string is the description of the test case.
// Function: The function is a callback function that contains the test case. 
// The callback function is an arrow function ( () => {} ) that contains the assertations for the test. In this case, the assertation is the expect function.
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});



// To test user made functions, insert test cases below in the TestingFramework.test.js file. [This is that file!]