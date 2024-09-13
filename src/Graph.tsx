import React, { Component } from "react";
import { Table } from "@finos/perspective";
import { ServerRespond } from "./DataStreamer";
import "./Graph.css";

/**
 * Props declaration for <Graph />
 */
interface IProps {
  data: ServerRespond[];
}

/**
 * Perspective library adds load to HTMLElement prototype.
 * This interface acts as a wrapper for the Typescript compiler.
 */
interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}

/**
 * React component that renders Perspective based on data
 * parsed from its parent through data property.
 */
class Graph extends Component<IProps, {}> {
  // Perspective table
  table: Table | undefined;

  render() {
    return React.createElement("perspective-viewer");
  }

  componentDidMount() {
    // Get the Perspective viewer element from the DOM
    const elem = document.getElementsByTagName(
      "perspective-viewer"
    )[0] as PerspectiveViewerElement;

    const schema = {
      stock: "string",
      top_ask_price: "float",
      top_bid_price: "float",
      timestamp: "date",
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference
      elem.load(this.table);

      // Add attributes to the Perspective viewer
      elem.setAttribute("view", "y_line"); // Set the graph type to line chart
      elem.setAttribute("column-pivots", '["stock"]'); // Set column pivot to stock
      elem.setAttribute("row-pivots", '["timestamp"]'); // Set row pivot to timestamp
      elem.setAttribute("columns", '["top_ask_price"]'); // Focus on top_ask_price
      elem.setAttribute(
        "aggregates",
        `
        {"stock": "distinct count",
         "top_ask_price": "avg",
         "top_bid_price": "avg",
         "timestamp": "distinct count"}`
      );
    }
  }

  componentDidUpdate() {
    // Update the data in the Perspective table every time the props data changes
    if (this.table) {
      this.table.update(
        this.props.data.map((el: any) => {
          return {
            stock: el.stock,
            top_ask_price: (el.top_ask && el.top_ask.price) || 0,
            top_bid_price: (el.top_bid && el.top_bid.price) || 0,
            timestamp: el.timestamp,
          };
        })
      );
    }
  }
}

export default Graph;
