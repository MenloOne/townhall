import React from 'react';

class MessageForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { message: '', disabled: false };
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({ disabled: true });

    this.props.onSubmit(this.state.message)
      .then(() => {
        if (this.props.type !== "Response") this.setState({ message: '', disabled: false, error: null });
      })
      .catch(error => this.setState({ error: error.message }));
  }

  onChange(event) {
    this.setState({ message: event.target.value });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <label>
          {this.props.type ? `${this.props.type}: ` : "Message: "}
          <input type="text" value={this.state.message} onChange={this.onChange.bind(this)} />
          <input type="submit" value="Send" disabled={this.state.disabled} />
        </label>
        {this.state.error && <p className="error">{this.state.error}</p>}
      </form>
    );
  }
}

export default MessageForm;
