import React, { useRef, useState } from 'react';
import '../views/Chat.css';
import chatIcon from '../views/images/chatIcon.png';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
//import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyDTtM5HXDpI3tKJL0ilMMu2S69sOpzuKRQ",
    authDomain: "chatcontract-b04e3.firebaseapp.com",
    projectId: "chatcontract-b04e3",
    storageBucket: "chatcontract-b04e3.appspot.com",
    messagingSenderId: "437197724910",
    appId: "1:437197724910:web:69adb8f470854307b2e7ff",
    measurementId: "G-F77SMN2FTS"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
//const analytics = firebase.analytics();


function Chat() {

  const [user] = useAuthState(auth);

  return (
    <div className="chat-app">
      <header>
        <h1>⚛️🔥💬</h1>
        <h2>ThunderHold ChatRoom for investors</h2>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
      <footer>
        <p>The first contract with chat incorporated</p>
      </footer>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <div className="sign-in">
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
      <img src={chatIcon} className='ChatIcon'/>
    </div>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default Chat;