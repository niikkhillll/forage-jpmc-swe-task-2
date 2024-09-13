import React, { Component } from "react";
import DataStreamer, { ServerRespond } from "./DataStreamer";
import Graph from "./Graph";
import "./App.css";

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[];
  showGraph: boolean; // Added showGraph to control graph visibility
}

/**
 * The parent element of the react app.
 * It renders title, button, and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false, // Initialize showGraph as false
    };
  }

  /**
   * Render Graph react component with state.data passed as a property to Graph
   */
  renderGraph() {
    // Render the Graph component only if showGraph is true
    if (this.state.showGraph) {
      return <Graph data={this.state.data} />;
    }
    return null;
  }

  /**
   * Get new data from server and update the state with the new data continuously
   */
  getDataFromServer() {
    this.setState({ showGraph: true }); // Show the graph when data starts streaming

    // Set an interval to fetch data every 100ms
    const intervalId = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update the state by adding the new data from the server
        this.setState({ data: serverResponds });
      });
    }, 100);

    // Stop the interval when the component is unmounted or if data stops streaming
    // Optionally, you can store intervalId to clear it if necessary
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">Bank & Merge Co Task 2</header>
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            // When the button is clicked, start streaming data continuously
            onClick={() => {
              if (!this.state.showGraph) {
                this.getDataFromServer();
              }
            }}
          >
            Start Streaming Data
          </button>
          <div className="Graph">{this.renderGraph()}</div>
        </div>
      </div>
    );
  }
}

export default App;
