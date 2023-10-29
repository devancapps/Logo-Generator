// Import required modules and classes
const fs = require('fs');
const inquirer = require('inquirer');
const { Triangle, Circle, Square } = require('./shapes');

// Function to generate the logo as an SVG string
async function generateLogo(userInput) {
  const shape = userInput.shape.toLowerCase();
  
  // Create an instance of the selected shape
  const shapeInstance = new { circle: Circle, triangle: Triangle, square: Square }[shape]();
  
  // Set the color for the selected shape
  shapeInstance.setColor(userInput.shapeColor);

  // Generate the SVG markup for the logo
  const svg = `
    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${userInput.textColor}" />
      ${shapeInstance.render()} // Render the selected shape
      <text x="140" y="105"${userInput.shapeColor}">${userInput.text}</text>
    </svg>
  `;

  return svg;
}

// Main function for the application
async function main() {
  try {
    // Get user input using Inquirer
    const userInput = await getUserInput();
    
    // Generate the logo SVG
    const logoSVG = await generateLogo(userInput);
    
    // Write the SVG to a file named "logo.svg"
    fs.writeFileSync('logo.svg', logoSVG);
    
    // Print a success message
    console.log('Generated logo.svg');
  } catch (error) {
    // Handle errors
    console.error('An error occurred:', error);
  }
}

// Function to get user input
async function getUserInput() {
  const questions = [
    {
      type: 'input',
      name: 'text',
      message: 'Enter up to three characters for the text:',
      validate: (input) => (input.length <= 3 ? true : 'Text must be up to three characters.'),
    },
    {
      type: 'input',
      name: 'textColor',
      message: 'Enter the text color (keyword or hex code):',
      validate: (input) => (input.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^[a-zA-Z]+$/) ? true : 'Invalid color input.'),
    },
    {
      type: 'list',
      name: 'shape',
      message: 'Choose a shape:',
      choices: ['circle', 'triangle', 'square'],
    },
    {
      type: 'input',
      name: 'shapeColor',
      message: 'Enter the shape color (keyword or hex code):',
      validate: (input) => (input.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^[a-zA-Z]+$/) ? true : 'Invalid color input.'),
    },
  ];

  try {
    const userInput = await inquirer.prompt(questions);
    return userInput;
  } catch (error) {
    throw new Error('Failed to get user input.');
  }
}

// Invoke the main function to run the application
main();
