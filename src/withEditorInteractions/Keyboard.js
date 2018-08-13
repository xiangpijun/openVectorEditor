import React from "react";

class Clipboard extends React.Component {
  // static propTypes = {
  //   value: PropTypes.string.isRequired
  // };

  static defaultProps = {
    className: "clipboard"
  };

  componentDidMount() {
    this.node.parentNode.addEventListener("keydown", this.handleKeyDown, false);
    this.node.parentNode.addEventListener("keyup", this.handleKeyUp, false);
  }

  componentWillUnmount() {
    this.node.parentNode.removeEventListener(
      "keydown",
      this.handleKeyDown,
      false
    );
    this.node.parentNode.removeEventListener("keyup", this.handleKeyUp, false);
  }

  handleKeyDown = e => {
    let metaKeyIsDown = e.ctrlKey || e.metaKey;
    if (!metaKeyIsDown || !['x', 'c', 'v'].includes(e.key)) {
      this.origFocusedElement = null;
      return;
    }
    this.origFocusedElement = document.activeElement;
    this.node.select();
  };

  handleKeyUp = () => {
    if (this.origFocusedElement) {
      this.origFocusedElement.focus();
    }
  };

  render() {
    let value = this.props.value;
    let style = {
      position: "fixed",
      // width: 0, //tnr: commented these out because they seem to be messing thing up if used...
      // height: 0,
      opacity: 0,
      left: 0,
      padding: 0,
      top: 0,
      margin: 0,
      zIndex: 100
    };
    return (
      <input
        ref={c => {
          if (c) {
            this.node = c;
          }
        }}
        style={style}
        type="text"
        value={value}
        onChange={noop}
        readOnly
        className="clipboard"
        onPaste={this.props.onPaste}
        onCopy={this.props.onCopy}
      />
    );
  }
}

export default Clipboard;
const noop = () => {};
