import React, { useEffect, useState } from "react";
import axios from 'axios'
import Main from "./Main";

function App() {

    const [token, setToken] = useState(null);
    const [id, setId] = useState(null);
    const [name, setName] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [alreadyVoted, setAlreadyVoted] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [anonymous, setAnonymous] = useState(false);

    const loginWithFacebook = () => {
        if(window.FB){
        window.FB.login((response) => {
            if(!response || !response.authResponse) return document.location.reload();
            const {authResponse:{accessToken, userID}} = response
            localStorage.setItem('acto', accessToken);
            localStorage.setItem('usid', userID);
            axios.post('/login-with-facebook', {accessToken, userID}).then((res)=>{
                if(res.status !== 200) return window.alert('Нэвтрэхэд алдаа гарлаа!');
                accessToken && setToken(accessToken);
                userID && setId(userID);
                res.data.person.name && setName(res.data.person.name)
                res.data.participants && setParticipants(res.data.participants)
                res.data.person.voted && setAlreadyVoted(res.data.person.voted);
                setLoaded(true);
                setLoaded(false);
                setLoaded(true);
                setAnonymous(null);
                // document.location.reload();
            }).catch((err)=>{
                localStorage.removeItem("acto");
                localStorage.removeItem("usid");
                document.location.reload();
            });
        },{scope: 'public_profile,email'});
        }
        else{
        document.location.reload();
        }
    };

    useEffect(()=>{
        if(localStorage.getItem('acto') && localStorage.getItem('usid')){
            const accessToken = localStorage.getItem('acto');
            const userID = localStorage.getItem('usid');
            axios.post('/login-with-facebook', {accessToken, userID}).then((res)=>{
                if(res.status !== 200) return window.alert('Нэвтрэхэд алдаа гарлаа!');
                accessToken && setToken(accessToken);
                userID && setId(userID);
                res.data.person.name && setName(res.data.person.name)
                res.data.participants && setParticipants(res.data.participants)
                res.data.person.voted && setAlreadyVoted(res.data.person.voted);
                setLoaded(true);
            }).catch((err)=>{
                localStorage.removeItem("acto");
                localStorage.removeItem("usid");
                document.location.reload();
            });
        }
        else{
            const go = async () => {
                let res = await axios('/get-info');
                setParticipants(res.data.participants);
                setAnonymous(true)
                setLoaded(true);
            }
            go();
        }
    },[])

    return (
        <div className="App">
            {loaded ? <Main click={loginWithFacebook} alreadyVoted={alreadyVoted} anonymous={anonymous} senderName={name} participants={participants} facebook={id}/> : 'Loading'}
        </div>
    );
}

export default App;
