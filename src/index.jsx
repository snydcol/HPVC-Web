import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'login'
    };
  }

  onLogin() {
    this.setState({
      view: 'avengers'
    });
  }

  render() {
    let component = (this.state.view === 'login')
      ? <Login onLogin={() => this.onLogin()} />
      : <Avengers />;

    return (
        <div className="app">
          {component}
          <HPCs />
        </div>
        );
  }
}

class Login extends React.Component {
  render() {
    return (
      <div id="login-form">
        <form id="login-utils">
          <input
            placeholder="Your name"
            id="username"
            name="username" />
          <br />
          <input
            placeholder="Probably password"
            type="password"
            id="password"
            name="password" />
          <br />
          <button
            id="login-btn"
            onClick={(evt) => {
              evt.preventDefault();
              alert('Hello');
            }}>Try to enter</button>
        </form>
      
      <button id="register"
        onClick={(evt) => {
          evt.preventDefault();
          alert('You\'re new?');
        }}>New?</button>

      </div>
    );
  }
}

class HPC extends React.Component {
  render() {
    return (
      <div className="hpc">
        <p>{this.props.name}</p>
        <p>Owner: {this.props.owner}</p>
      </div>
    );
  }
}

class HPCs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hpcs: [{key: 1, name: 'HPC_1', owner: 'None'},
              {key: 2, name: 'HPC_2', owner: 'None'},
              {key: 3, name: 'HPC_3', owner: 'None'},
              {key: 4, name: 'HPC_4', owner: 'None'},
              {key: 5, name: 'HPC_5', owner: 'None'},
              {key: 6, name: 'HPC_6', owner: 'None'},
              {key: 7, name: 'HPC_7', owner: 'None'},
              {key: 8, name: 'HPC_8', owner: 'None'},
             ],
    };
  }

  render() {
    let compList = [];
    this.state.hpcs.forEach(comp => {
        compList.push(<HPC key={comp.key} name={comp.name} owner={comp.owner} />);
        });

    return (
      <div className="HPC-list">
        {compList} 
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('content'));







