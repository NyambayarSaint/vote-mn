import React, { useEffect, useState } from "react";
var FB = window.FB;

function App() {
    useEffect(() => {
      // FB.api('/me', {fields: 'last_name'}, function(response) {
      //   console.log(response);
      // });
    }, []);

    const [token, setToken] = useState(null)
    const [id, setId] = useState(null)

    const loginWithFacebook = () => {
        if(FB){
          FB.login((response) => {
            const {authResponse:{accessToken, userID}} = response
            setToken(accessToken);
            setId(userID);
            // console.log(accessToken,'access token')
            // console.log(userID,'user id ')
            fetch('/login-with-facebook', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({accessToken, userID})
            }).then(res => {
              console.log(res,'heey');
            });
        },{scope: 'public_profile,email'});
        }
        else{
          document.location.reload();
        }
    };

    return (
        <div className="App">
            <button onClick={loginWithFacebook}>Fb</button>
            {/* {token && id ? <div></div> : <button onClick={loginWithFacebook}>Fb</button>} */}
        </div>
    );
}

export default App;
