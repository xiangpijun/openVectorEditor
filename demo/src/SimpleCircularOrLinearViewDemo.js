import React from "react";
import { Callout } from "@blueprintjs/core";

import { SimpleCircularOrLinearView } from "../../src";
import renderToggle from "./utils/renderToggle";

export default class SimpleCircularOrLinearViewDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <div>
        <Callout>
          This view is meant to be a helper for showing a simple (non-redux
          connected) circular or linear view!
        </Callout>

        <div>
          {renderToggle({
            that: this,
            type: "hoverPart",
            label: "Toggle Part 1 Hover"
          })}
          {renderToggle({ that: this, type: "hideNameAndInfo" })}
          {renderToggle({ that: this, type: "circular" })}
          {renderToggle({ that: this, type: "changeSize" })}
        </div>
        <br />
        <br />
        <br />
        <br />

        <SimpleCircularOrLinearView
          {...{
            ...(this.state.hideNameAndInfo && { hideName: true }),
            ...(this.state.hoverPart && { hoveredId: "fakeId1" }),
            ...(this.state.changeSize && { height: 500, width: 500 }),

            sequenceData: {
              // annotationLabelVisibility: {
              //   parts: false,
              //   features: false,
              //   cutsites: false,
              //   primers: false
              // },
              // annotationVisibility: {
              //   axis: sequenceData.circular
              // }
              name: "Test Seq",
              circular: this.state.circular, //toggle to true to change this!
              parts: [
                {
                  name: "Part 1",
                  id: "fakeId1",
                  start: 10,
                  end: 20
                },
                {
                  name: "Part 2",
                  id: "fakeId2",
                  start: 25,
                  end: 30
                }
              ],
              sequence:
                "GGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacacccccc"
            }
          }}
        />

        <br /><code>

        <pre>
          {`<SimpleCircularOrLinearView
  {...{
    ...(this.state.hideNameAndInfo && { hideName: true }),
    ...(this.state.hoverPart && { hoveredId: "fakeId1" }),
    ...(this.state.changeSize && { height: 500, width: 500 }),

    sequenceData: {
      name: "Test Seq",
      circular: this.state.circular, //toggle to true to change this!
      parts: [
        {
          name: "Part 1",
          id: "fakeId1",
          start: 10,
          end: 20
        },
        {
          name: "Part 2",
          id: "fakeId2",
          start: 25,
          end: 30
        }
      ],
      sequence:
        "GGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacacccccc"
    }
  }}
/>`
            .split("\n")
            .map((l, i) => (
              <div key={i}>{l}</div>
            ))}
        </pre>
        </code>
      </div>
    );
  }
}