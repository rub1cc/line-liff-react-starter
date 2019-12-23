import React from 'react';
import logo from './logo.svg';
import './App.css';

const liff = window.liff

const App = () => {

  const [os, setOs] = React.useState('')
  const [language, setLanguage] = React.useState('')
  const [version, setVersion] = React.useState('')
  const [isInClient, setIsInClient] = React.useState('')
  const [isLoggedIn, setIsLoggedIn] = React.useState('')
  const [isLoggedInText, setIsLoggedInText] = React.useState('')
  const [profile, setProfile] = React.useState('')

  React.useEffect(() => {
    initializeLiff()
  }, [])

  const initializeLiff = () => {
    liff
      .init({
        liffId: process.env.REACT_APP_LIFF_ID
      })
      .then(() => {
        initializeApp()
      })
      .catch((err) => {
        alert(err)
      })
  }

  const initializeApp = () => {
    displayLiffData();
    displayIsInClientInfo();
  }

  const displayLiffData = () => {
    setOs(liff.getOS())
    setLanguage(liff.getLanguage())
    setVersion(liff.getVersion())
    setIsInClient(liff.isInClient())
    setIsLoggedIn(liff.isLoggedIn())
    setIsLoggedInText(liff.isLoggedIn() ? 'True' : 'False')
    liff.getProfile().then(profile => setProfile(profile))
  }

  const displayIsInClientInfo = () => {
    if (liff.isInClient()) {
      setIsInClient('You are opening the app in the in-app browser of LINE.');
    } else {
      setIsInClient('You are opening the app in an external browser.');
    }
  }

  const handleOpenExternalWindowButton = () => {
    liff.openWindow({
      url: 'https://line.me',
      external: true
    });
  }

  const handleCloseLIFFAppButton = () => {
    if (!liff.isInClient()) {
      sendAlertIfNotInClient()
    } else {
      liff.closeWindow();
    }
  }

  const handleOpenQRCodeScannerButton = () => {
    if (!liff.isInClient()) {
      sendAlertIfNotInClient();
    } else {
      liff.scanCode().then(result => {
        // e.g. result = { value: "Hello LIFF app!" }
        const stringifiedResult = JSON.stringify(result);
        alert(stringifiedResult);
      }).catch(err => {
        alert("scanCode failed!");
      });
    }
  }

  const handleSendMessageButton = () => {
    if (!liff.isInClient()) {
      sendAlertIfNotInClient();
    } else {
      liff.sendMessages([{
        'type': 'text',
        'text': "You've successfully sent a message! Hooray!"
      }]).then(function () {
        window.alert('Message sent');
      }).catch(function (error) {
        window.alert('Error sending message: ' + error);
      });
    }
  }

  const handleGetAccessTokenButton = () => {
    if (!liff.isLoggedIn() && !liff.isInClient()) {
      alert('To get an access token, you need to be logged in. Please tap the "login" button below and try again.');
    } else {
      const accessToken = liff.getAccessToken();
      alert(accessToken);
    }
  }

  const handleLogginButton = () => {
    if (!liff.isLoggedIn()) {
      // set `redirectUri` to redirect the user to a URL other than the front page of your LIFF app.
      liff.login();
    }
  }

  const handleLogoutButton = () => {
    if (liff.isLoggedIn()) {
      liff.logout();
      window.location.reload();
    }
  }

  const sendAlertIfNotInClient = () => {
    alert('This button is unavailable as LIFF is currently being opened in an external browser.');
  }

  return (
    <div className="App">
      <header className="App-header">
        {
          isLoggedIn ? (
            <React.Fragment>
              <img src={profile.pictureUrl} className="Profile-picture" alt="profile-picture" />
              <h4>{profile.statusMessage}</h4>
            </React.Fragment>
          ) : <img src={logo} className="App-logo" alt="logo" />
        }
      </header>
      <section>
        <div className="Card-info">
          <h3>OS</h3>
          <p>{os}</p>
        </div>
        <div className="Card-info">
          <h3>Language</h3>
          <p>{language}</p>
        </div>
        <div className="Card-info">
          <h3>LIFF SDK Version</h3>
          <p>{version}</p>
        </div>
      </section>
      <section>
        <div className="Card-info">
          <h3>Is in Client</h3>
          <p>{isInClient}</p>
        </div>
        <div className="Card-info">
          <h3>Login as</h3>
          <p>
            {isLoggedIn ? profile.displayName : '-'}
          </p>
        </div>
      </section>
      <section>
        <button onClick={handleOpenExternalWindowButton}>Open External Window</button>
        <button onClick={handleCloseLIFFAppButton}>Close LIFF App</button>
        <button onClick={handleOpenQRCodeScannerButton}>Open QR Code Scanner</button>
      </section>
      <section>
        <button onClick={handleSendMessageButton}>Send Message</button>
        <button onClick={handleGetAccessTokenButton}>Get Access Token</button>
        {
          isLoggedIn ? <button onClick={handleLogoutButton}>Log Out</button> : <button onClick={handleLogginButton}>Log In</button>
        }
      </section>
      <footer>
        Made with ❤️ by Farazaulia
      </footer>
    </div>
  );
}

export default App;
