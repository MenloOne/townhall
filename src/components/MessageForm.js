import React from 'react';

class MessageForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { message: '' };
  }

  onSubmit(event) {
    event.preventDefault();

    this.props.onSubmit(this.state.message)
      .then(() => this.setState({ message: '' }));
  }

  onChange(event) {
    this.setState({ message: event.target.value });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <label>
          Message:
          <input type="text" value={this.state.message} onChange={this.onChange.bind(this)} />
          <input type="submit" value="Send" />
        </label>
        {this.props.error}
      </form>
    );
  }
}

export default MessageForm;
