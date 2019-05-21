import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'login',
      loggedIn: false,
    };
  }

  doLogin(u) {
    this.setState({
      view: 'loggedIn',
      username: u,
      loggedIn: true,
    });
  }

  doLogout() {
    this.setState({
      view: 'login',
      loggedIn: false,
    });
  }

  switchToRegister() {
    this.setState({
      view: 'register',
      loggedIn: false,
    });
  }

  switchToLogin() {
    this.setState({
      view: 'login',
      loggedIn: false,
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
          <HPCs logUser={this.state.username} loggedIn={this.state.loggedIn}/>
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
            className= "btn btn-secondary"
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
            className= "btn btn-secondary"
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
            className= "btn btn-secondary"
            onClick={(evt) => {
            evt.preventDefault();
            this.logoutRequest();
          }}>Logout</button>
        </div>
    );
  }
}

class HPC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name,
      owner: this.props.owner,
      release_date: this.props.release_date,
    };

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.name,
      owner: nextProps.owner,
      release_date: nextProps.release_date,
    });
    
  }

  sendReserveRequest(comp, time) {
    //alert("You want to reserve "+comp+" for "+time+" hours");
    var data = new FormData();
    data.set("computer", comp);
    data.set("reserve_time", time);
    console.log("request:"+data);
    window.fetch('/api/reserve/', {
          method: 'POST',
          body: data,
        })
        .then(result => result.text())
        .then(
              (result) => {
                result = JSON.parse(result);
                console.log("Receiving:");console.log(result);
                if (result.rstatus === 'ok') {
                  this.setState({owner: result.username,
                            release_date: result.reservTil});
                }
                else
                  alert('Sent request but failed.');
              },
              (error) => { alert('Something happened?????'); },
            );
  }

  sendReleaseRequest(comp) {
    var f = new FormData();
    f.set("computer", comp);
    window.fetch('/api/release/', {
          method: 'POST',
          body: f,
        }).then(result => result.text())
        .then((result) => {
              if (result === 'ok') {
                this.setState({
                  owner: null,
                  release_date: null,
                 });
              }
              else
                alert('It was not released');
            }, (error) => {alert('Something happened????'); },
            );
  }
  
  render() {
    //console.log("HPC says user is "+this.props.loggedIn+" logged in");
    var hpcstatus = "hpc";
    if (this.state.owner != null) 
      hpcstatus = "takenhpc";

    if (this.props.loggedIn === true)
      return (
        <div className={hpcstatus}>
          <p>{this.state.name}</p>

          <table className="table table-borderless">
            <tbody>
                {this.props.logUser == this.state.owner ? (
                  <tr>
                    <td>Owner: <strong>{this.state.owner}</strong></td>
                    <td>Release date: <strong>{this.state.release_date}</strong></td>
                  </tr>
                ) : (
                <tr>
                  <td>Owner: {this.state.owner}</td>
                  <td>Release date: {this.state.release_date}</td>
                </tr>
                  )}
              <tr>
                {this.state.owner == null ? (
                <td>
                  <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Reserve 
                    </button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">

                      <a className="dropdown-item" onClick=
                              {(evt) => {
                                evt.preventDefault(); 
                                this.sendReserveRequest(this.state.name, 2);
                              }}>2 hours</a>

                      <a className="dropdown-item" onClick=
                              {(evt) => {
                                evt.preventDefault(); 
                                this.sendReserveRequest(this.state.name, 4);
                              }}>4 hours</a>
                      <a className="dropdown-item" onClick=
                              {(evt) => {
                                evt.preventDefault(); 
                                this.sendReserveRequest(this.state.name, 12);
                              }}>12 hours</a>
                      <a className="dropdown-item" onClick=
                              {(evt) => {
                                evt.preventDefault(); 
                                this.sendReserveRequest(this.state.name, 24);
                              }}>24 hours</a>
                    </div>
                  </div>
                </td> ) : (
                  <td/>
                  )}

                  {this.props.logUser == this.state.owner ? (
                    <td>
                      <button className="btn btn-danger" id="release"
                        onClick={(evt) => {
                          evt.preventDefault();
                          this.sendReleaseRequest(this.state.name);
                        }}>Release</button>
                    </td>
                ) : (
                    <td>
                    </td>
                  )}
              </tr>
            </tbody>
          </table>
        </div>
      );

    else
      return (
        <div className={hpcstatus}>
          <p>{this.props.name}</p>

          <table className="table table-borderless">
            <tbody>
              <tr>
                <td>Owner: {this.props.owner}</td>
                <td>Release date: {this.props.release_date}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
  }
}

class HPCs extends React.Component {

  getComputers() {
    window.fetch('/api/timeToLive/', {
          method: 'GET',
        })
        .then(result => result.text())
        .then(
              (result) => {
                this.setState({
                  computers: JSON.parse(result)});
              },
              (error) => { },
            );
  }

  constructor(props) {
    super(props);

    this.state = {
      hpcs: [{key: 1, name: 'HPC_1', owner: 'None', release_date: 'YYYY'},
             {key: 2, name: 'HPC_2', owner: 'None', release_date: 'YYYY'},
             {key: 3, name: 'HPC_3', owner: 'None', release_date: 'YYYY'},
             {key: 4, name: 'HPC_4', owner: 'None', release_date: 'YYYY'},
             {key: 5, name: 'HPC_5', owner: 'None', release_date: 'YYYY'},
             {key: 6, name: 'HPC_6', owner: 'None', release_date: 'YYYY'},
             {key: 7, name: 'HPC_7', owner: 'None', release_date: 'YYYY'},
             {key: 8, name: 'HPC_8', owner: 'None', release_date: 'YYYY'},
            ],
      computers: [],
    };
    this.getComputers = this.getComputers.bind(this);
    this.getComputers();
  }

  componentDidMount() {
    setInterval(this.getComputers, 10000);
  }

  render() {
    
    let compList = [];
    try {
      this.state.computers.forEach(comp => {
          compList.push(<HPC logUser={this.props.logUser} name={comp.computername} key={comp.compID} owner={comp.username} release_date={comp.reservTil} loggedIn={this.props.loggedIn} />);
          });
    }
    catch (e) {console.log(e);}

    return (
      <div className="HPC-list">
        {compList} 
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('content'));







