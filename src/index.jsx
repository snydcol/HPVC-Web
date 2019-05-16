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
      <form id="login-form">
        <input
          placeholder="Your name"
          id="username"
          name="username" />
        <br />
        <input
          placeholder="Probably password"
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
    );
  }
}

class HPC extends React.Component {
  render() {
    return (
      <div className="hpc">
        <p>Name: {this.props.name}</p>
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
             ],
    };
  }

  render() {
    let compList = [];
    this.state.hpcs.forEach(comp => {
        compList.push(<HPC key={comp.key} name={comp.name} owner={comp.owner} />);
        });

    return (
      <div>
        Number of items: {compList.length} 
        <div className="HPC-list">
          {compList} 
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('content'));







