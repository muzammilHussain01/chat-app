import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Chip from '@mui/material/Chip';
import {io} from "socket.io-client"
import {useEffect, useState} from "react";
const socket = io("http://localhost:5000");
function ChatBox() {
    const [message, setMessage] = useState([]);
    const [input, setInput] = useState("");
    useEffect(() => {
        // Correct client-side event
        socket.on("connect", () => {
            console.log("Socket ID:", socket.id);
        });
        // recive message
        socket.on("reciveMessage", (msg) => {
            setMessage(prevState => [...prevState, {text: msg, from: "bot"}])
        })

        // Cleanup
        return () => {
            socket.off("connect");
            socket.off("reciveMessage")
        };
    }, []);
    const handleChange = (e) =>{
        e.preventDefault();
        setInput(e.target.value);
    }
    const handleSendMessage = (e) =>{
        e.preventDefault();
        if(input.trim() === "") return;
        // Send the message to single user
        socket.emit("sendMessage", input);
        setMessage(prevState => [...prevState, {text: input, from: "user"}])
        setInput("");
    }
    const handleKeyDown = (e) => {
        if(e.key === "Enter"){
            handleSendMessage(e);
            console.log(`Pressed key is ${e.key}`)
        }
    }

    return (
        <Card style={{ width: '18rem', height: "25rem", display: "flex", flexDirection: "column"}}>
            {/* Chat Header */}
            <Card.Header className="text-center fw-bold p-2">
                Chatbot
            </Card.Header>

            {/* Messages area */}
            <Card.Body
                style={{
                // flex: 1,
                overflowY: "auto",
                // padding: "10px",
                display: "flex",
                flexDirection: "column"
            }}
            >
                {message.map((msg, index) => (
                    <span
                        key={index}
                        style={{
                            backgroundColor: msg.from === "user" ? "lightBlue" : "gray",
                            color: "white",
                            borderRadius: "5px",
                            padding: "6px 10px",
                            marginBottom: "6px",
                            display: "block",
                            marginLeft: msg.from === "user" ? "0" : "auto",
                            marginRight: msg.from === "user" ? "auto" : "0",
                            width: "fit-content"
                        }}
                    >
                        {msg.text}
                    </span>
                ))}
            </Card.Body>

            {/* Input area */}
            <InputGroup className="p-2">
                <Form.Control placeholder="Type a message..." value={input} onChange={handleChange} onKeyDown={handleKeyDown}/>
                <Button variant="primary" onClick={handleSendMessage} >Send</Button>
            </InputGroup>
        </Card>

    );
}

export default ChatBox;