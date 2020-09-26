import Axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {AnimatePresence, motion} from 'framer-motion';
import {FaFacebookF} from 'react-icons/fa'
import {AiOutlineClose} from 'react-icons/ai'
import {GiClick} from 'react-icons/gi'

const Main = ({ participants, facebook, senderName, alreadyVoted, anonymous, click }) => {

    const [already, setAlready] = useState(alreadyVoted);
    const [error, setError] = useState('');
    const [override, setOverride] = useState(false);
    const [secureData, setSecureData] = useState({});
    const [total, setTotal] = useState(null)

    const handler = async (requestingPlayerName) => {
        if(facebook, senderName && !anonymous){
            Axios.post('/vote', {requestingPlayerName, facebook, sender: senderName})
                .then((res)=>{
                    setError('Амжилттай саналаа өглөө!');
                    setAlready(res.data.voted);
                })
                .catch(()=>setError('Дахин санал өгөх боломжгүй!'))
        }
        else{
            setError('Саналаа өгөхийн тулд нэвтрэх шаардлагатай! (Дахин баталгаажуулах)');
        }
    }

    useEffect(()=>{
        let width = window.innerWidth
        let height = window.innerHeight
        let top = document.querySelector('.top').offsetHeight;
        let bot = document.querySelector('.bottom').offsetHeight;
        let final = height - top - bot;
        document.querySelector('iframe').style.width = width + 'px';
        document.querySelector('iframe').style.height = final + 'px';
        document.querySelector('iframe').style.boxSizing = 'border-box';
        document.querySelector('iframe').style.paddingTop = '50px';
        document.querySelector('iframe').style.paddingBottom = '50px';
        
    },[])













    const securityHandler = () => {
        let pass = window.prompt('.');
        pass === "Soccer91270817" && setOverride(true);
    }

    const loadSecure = async () => {
        let res = await Axios.get('/get-auth-no');
        let tmp = 0
        res.data && res.data.users && res.data.users.map(el=>el.voted && el.voted.length > 1 && tmp++);
        setTotal(tmp);
        setSecureData(res.data)
    }

    const handleCloseSecurity = () => {
        setOverride(false);
    }


    return (
        <Container>
            <div className="top" style={{backgroundImage: `linear-gradient(45deg, #002ebf, #2891eb)`}}>
                <div className="imgcon">
                <img src={'https://i.imgur.com/t9rOsAW.png'} />
                <img src={'https://i.imgur.com/uHawS7U.png'} />
                </div>
                
                <h2 style={{textAlign:'center',color:'white'}}>Үндэсний дээд лиг 2020 улиралын шилдэг гоолын санал авах хуудас</h2>
                <div className="imgcon">
                <img style={{width:40,height:40}} src={'https://i.imgur.com/9u1POUD.png'} onClick={securityHandler} />
                <img src={'https://i.imgur.com/ByZAObT.png'} />
                </div>
                
            </div>
            <div className="body">
                <div style={{margin:'0px', padding:'0px', overflow: 'hidden'}}>
                    <iframe src="https://www.youtube.com/embed/Nbst6fgBkUw" frameBorder={0} style={{overflow: 'hidden', height: '100%', width: '100%'}} height="100%" width="100%" />
                </div>
            </div>
            <div className="bottom" >
                {participants.map((el, i) => {
                    return (
                        <div className={`prt ${already === el.name && 'voted'}`} key={i + "p"} onClick={()=>handler(el.name)}>
                            <div className="img" style={{backgroundImage:`url(${el.img})`}}><div className="caption">VOTED</div></div>
                            <h4>{el.name}</h4>
                            <p>{el.team}</p>
                        </div>
                    );
                })}
            </div>
            <AnimatePresence>
                {error &&
                    <motion.div initial={{opacity:0}} animate={{opacity:1, transition: {duration: 0.3}}} exit={{opacity:0}} id="dialog">
                        <div className="content">
                            <h4>{error}</h4>
                            {anonymous && <div className="fb-con" onClick={click}><FaFacebookF className="f"/><p>Continue with Facebook</p></div>}
                            {!anonymous && <div className="fb-con"><FaFacebookF className="f"/><p>Logged in as {senderName}</p></div>}
                            <AiOutlineClose className="x" onClick={()=>setError('')}/>
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
            <AnimatePresence>
                {override &&
                <motion.div initial={{opacity:0}} animate={{opacity:1, transition: {duration: 0.3}}} exit={{opacity:0}} id="dialog" className="anotherDialog">
                    <div className="content">
                        <h4 onClick={loadSecure} style={{marginBottom: 50, textAlign:'center'}}>Нийт тоглогчдийн санал харах <GiClick/></h4>
                        {secureData.parts && secureData.parts.length && secureData.parts.map((el,i)=>{
                            return(
                                <div style={{marginBottom:10,textAlign:'center'}} key={i+'vs'}>"{el.name}" - {el.votes.length} саналтай байна.</div>
                            )
                        })}
                        {secureData.users && <div style={{textAlign:'center',fontWeight:'bold',marginTop:30}}>Нийт бүртгүүлсэн хэрэглэгчдийн тоо : {secureData.users && secureData.users.length}<br/></div>}
                        {total && <div style={{textAlign:'center',fontWeight:'bold',marginTop:15}}>Нийт саналаа амжилттай өгсөн хүний тоо : {total}<br/></div>}
                        <div style={{marginTop:50,textAlign:'center',border:'1px solid rgba(0,0,0,0.1)', padding:15,cursor:'pointer'}} onClick={handleCloseSecurity}>Цонхыг хаах <AiOutlineClose/></div>
                    </div>
                </motion.div>}
            </AnimatePresence>
            
        </Container>
    );
};

export default Main;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100vw;
    height: 100vh;
    #dialog{
        display:flex;
        justify-content:center;
        align-items:center;
        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        background:rgba(0,0,0,0.6);
        .content{
            position:relative;
            padding:60px 5vw;
            background:white;
            max-width:100vw;
            .fb-con{
                max-width:100%;
                background: rgb(59,89,152);
                color: white;
                padding: 10px 15px;
                position: relative;
                text-align: center;
                margin-top:20px;
                p{
                    margin:0px;
                    margin-left:25px;
                }
                .f{
                    position: absolute;
                    left: 15px;
                    font-size:18px;
                }
                &:hover{
                    cursor:pointer;
                }
            }
            h4{
                margin:0px;
                text-align:center;
            }
            .x{
                position:absolute;
                top:15px;
                right:15px;
                font-size:24px;
                &:hover{
                    cursor:pointer;
                }
            }
        }
    }
    .anotherDialog{
        h4{
            border:1px solid rgba(0,0,0,0.1);
            padding:15px;
            &:hover{
                cursor:pointer;
            }
        }
    }
    .top {
        width: 100%;
        background: rgba(0, 0, 0, 0.1);
        display:flex;
        justify-content: center;
        align-items:center;
        img{
            height:50px;
            margin:0px 15px;
            
        }
        .imgcon{
            display:flex;
        }
    }
    .body {
    }
    .bottom {
        width: 100%;
        padding: 25px;
        box-sizing: border-box;
        overflow-x: scroll;
        overflow-y: hidden;
        white-space: nowrap;
        text-align: center;
        border-top:1px solid rgba(0,0,0,0.2);
        ${'' /* color:white; */}
        .prt {
            display: inline-block;
            margin-right: 30px;
            position:relative;
            &:hover{
                cursor:pointer;
                .img{
                    opacity:0.7;
                }
            }
            &:last-child {
                margin-right: 0px;
            }
            .img {
                width: 100px;
                height: 100px;
                background-size:cover;
                background-position:center center;
                border-radius: 100%;
                box-sizing:border-box;
                border:3px solid #002ebf;
                margin:0px auto;
                .caption{
                    line-height:100px;
                    width:100%;
                    height:100%;
                    font-weight:bold;
                    border-radius:100%;
                    color:#002ebf;
                    display:none;
                }
            }
            h4 {
                margin-bottom: 0px;
                margin-top: 10px;
            }
            p {
                margin-top: 4px;
                margin-bottom: 0px;
            }
        }
        .prt.voted {
            .img{
                border:3px solid red;
                .caption{
                    background:rgba(255,255,255,0.5);
                    display:block;
                }
            }
        }
    }
    .bottom::-webkit-scrollbar {
        height:8px;
    }
    
    .bottom::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }
    
    .bottom::-webkit-scrollbar-thumb {
        background-color: rgb(0,46,191,0.6);
        border-radius: 10px;
    }
    .bottom:hover::-webkit-scrollbar-thumb{
        background-color: #002ebf;
    }
    @media only screen and (max-width: 768px){
        h2{
            font-size:16px;
        }
        .top{
            img{
                height:30px;
            }
            .imgcon{
                flex-direction:column;
                img{
                    &:first-child{
                        margin-bottom:7.5px;
                        margin-top:15px;
                    }
                    &:last-child{
                        margin-bottom:15px;
                    }
                }
            }
        }
    }
`;
