# Floyd-Warshall Algorithm Visualizer

An interactive web application for visualizing the Floyd-Warshall algorithm, a dynamic programming algorithm for finding shortest paths in a weighted graph. Built with React and TypeScript.

**🌐 Live Demo**: [https://mihnea-popescu.github.io/algorithms-visualizer/](https://mihnea-popescu.github.io/algorithms-visualizer/)

## Features

- **Interactive Matrix Input**: Create and edit adjacency matrices with customizable graph sizes (1-12 vertices)
- **Step-by-Step Visualization**: Watch the Floyd-Warshall algorithm execute step by step with detailed explanations
- **Graph Visualization**: Interactive force-directed graph representation of your input matrix
- **Real-time Updates**: See which cells are updated at each step with hover tooltips showing calculation details
- **Educational Content**: Built-in explanations of the Floyd-Warshall formula and algorithm steps

## Algorithm Overview

The Floyd-Warshall algorithm finds the shortest paths between all pairs of vertices in a weighted graph. It uses the dynamic programming approach with the recurrence relation:

```
dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
```

Where `k` represents the intermediate vertex being considered at each step.

## How to Use

1. **Set Graph Size**: Use the size input to specify the number of vertices (n×n matrix)
2. **Input Edge Weights**:
   - Enter numeric values for edge weights
   - Leave blank or use "∞" for no edge between vertices
   - Diagonal elements are automatically set to 0
3. **Compute**: Click the "Compute" button to run the Floyd-Warshall algorithm
4. **Navigate Steps**: Use the navigation controls to step through the algorithm:
   - ⏮ First step
   - ◀ Previous step
   - ▶ Next step
   - ⏭ Last step
   - Slider for quick navigation
5. **Explore Results**:
   - Hover over highlighted cells to see calculation details
   - View the interactive graph visualization
   - Understand the algorithm progression through the formula explanations

## Technical Details

- **Frontend**: React 19 with TypeScript
- **Visualization**: react-force-graph-2d for interactive graph rendering
- **Algorithm**: Custom implementation of Floyd-Warshall with step-by-step tracking
- **Styling**: Custom CSS with responsive design

## Project Structure

```
src/
├── algorithms/
│   └── floyd/
│       ├── floydAlgorithm.ts      # Core algorithm implementation
│       └── FloydMatrixTable.tsx   # Matrix display component
├── components/
│   └── GraphVisualization.tsx     # Interactive graph component
├── App.tsx                        # Main application component
└── styles.css                     # Application styles
```

## Available Scripts

### `yarn start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## Learn More

- [Floyd-Warshall Algorithm](https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm)
- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
