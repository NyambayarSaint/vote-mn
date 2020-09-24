import Axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {AnimatePresence, motion} from 'framer-motion';
import {FaFacebookF} from 'react-icons/fa'
import {AiOutlineClose} from 'react-icons/ai'

const Main = ({ participants, facebook, senderName, alreadyVoted, anonymous, click }) => {

    const [already, setAlready] = useState(alreadyVoted);
    const [error, setError] = useState('')

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
            setError('Саналаа өгөхийн тулд нэвтрэх шаардлагатай!');
        }
    }

    return (
        <Container>
            <div className="top"></div>
            <div className="body">hehe</div>
            <div className="bottom">
                {participants.map((el, i) => {
                    return (
                        <div className={`prt ${already === el.name && 'voted'}`} key={i + "p"} onClick={()=>handler(el.name)}>
                            <div className="img" style={{backgroundImage:`url(https://i2-prod.football.london/incoming/article18882096.ece/ALTERNATES/s615/0_GettyImages-1266331344.jpg)`}}><div className="caption">VOTED</div></div>
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
                            {anonymous && <div className="fb-con" onClick={click}><FaFacebookF className="f"/>Continue with Facebook</div>}
                            {!anonymous && <div className="fb-con"><FaFacebookF className="f"/>Logged in as {senderName}</div>}
                            <AiOutlineClose className="x" onClick={()=>setError('')}/>
                        </div>
                    </motion.div>
                }
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
    .top {
        width: 100%;
        height: 80px;
        background: rgba(0, 0, 0, 0.1);
    }
    .body {
    }
    .bottom {
        width: 100%;
        padding: 25px;
        box-sizing: border-box;
        overflow-x: scroll;
        white-space: nowrap;
        text-align: center;
        border-top:1px solid rgba(0,0,0,0.2);
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
`;
