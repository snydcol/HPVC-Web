import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'login',
    };
  }

  doLogin(u) {
    this.setState({
      view: 'loggedIn',
      username: u,
    });
  }

  doLogout() {
    this.setState({
      view: 'login',
    });
  }

  switchToRegister() {
    this.setState({
      view: 'register',
    });
  }

  switchToLogin() {
    this.setState({
      view: 'login',
    });
  }

  render() {
    let component = (this.state.view === 'login')
      ? <Login switchToRegister={() => this.switchToRegister()} doLogin={(u) => this.doLogin(u)} />
      : <UserInfo uname={this.state.username} doLogout={() => this.doLogout()} />;

    if (this.state.view === 'register')
      component = <Register switchToLogin={() => this.switchToLogin()} doLogin={(u) => this.doLogin(u)} />;
      
    return (
        <div className="app">
          {component}
          <HPCs />
        </div>
        );
  }
}

class Login extends React.Component {

  loginRequest() {
    var data = new FormData(document.querySelector('#login-utils'));
    var user = data.get('username');
    console.log(data.get('username'));
    window.fetch('/api/login/', {
          method: 'POST',
          body: data,
        })
        .then(result => result.text())
        .then(
              (result) => {
                if (result === 'ok') 
                  this.props.doLogin(user);
                else
                  alert('Bad combination');
              },
              (error) => { alert('Something happened?????'); },
            );
  }

  render() {
    return (
      <div className="login-form">
        <p><strong> Logging in ! </strong></p>
        <form className="utils" id="login-utils">
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
              this.loginRequest();
            }}>Try to enter</button>
        </form>
      
      <button className="clear-btn" id="register"
        onClick={(evt) => {
          evt.preventDefault();
          this.props.switchToRegister();
        }}>New?</button>

      </div>
    );
  }
}

class Register extends React.Component {

  registerRequest() {
    var data = new FormData(document.querySelector('#register-utils'));
    var user = data.get('username');
    window.fetch('/api/register/', {
          method: 'POST',
          body: data,
        })
        .then(result => result.text())
        .then(
              (result) => {
                if (result === 'ok') 
                  this.props.doLogin(user);
                else
                  alert('Bad register?');
              },
              (error) => { alert('Something happened?????'); },
            );
  }

  render() {
    return (
      <div className="login-form">
        <form className="utils" id="register-utils">
          <p><strong> Signing up ! </strong></p>
          <input
            placeholder="Name you want"
            id="username"
            name="username" />
          <br />
          <input
            placeholder="Password you want"
            type="password"
            id="password"
            name="password" />
          <br />
          <button
            id="register-btn"
            onClick={(evt) => {
              evt.preventDefault();
              this.registerRequest();
            }}>Sign UP</button>
        </form>
      <button className="clear-btn" id="register"
        onClick={(evt) => {
          evt.preventDefault();
          this.props.switchToLogin();
        }}>Back to login</button>
      </div>
    );
  }
}

class UserInfo extends React.Component {

  logoutRequest() {
    window.fetch('/api/logout/', {
          method: 'POST',
        })
        .then(result => result.text())
        .then(
              (result) => {
                if (result === 'ok') 
                  this.props.doLogout();
                else
                  alert('You\'re logged out..but something went wrong.');
              },
              (error) => { alert('Something happened?????'); },
            );
  }

  render() {
    return (
      <div id="welcome-message" className="login-form">
        <p>Hello {this.props.uname} </p>
        
        <button id="logout"
          onClick={(evt) => {
            evt.preventDefault();
            this.logoutRequest();
          }}>Logout</button>
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







