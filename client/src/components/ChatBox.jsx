// ChatBox.jsx
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import SideBar from "./SideBar.jsx";
import CreateGroup from "../CreateGroup.jsx";
import AddNewUser from "./AddNewUser.jsx";

const socket = io("http://localhost:5000");

function ChatBox() {
    const [message, setMessage] = useState([]);
    const [input, setInput] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Socket ID:", socket.id);
        });

        // FIXED: Correct structure for receiving messages
        socket.on("reciveMessage", (msg) => {
            setMessage((prev) => [...prev, { text: msg.text, from: msg.from }]);
        });

        return () => {
            socket.off("connect");
            socket.off("reciveMessage");
        };
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        setInput(e.target.value);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (input.trim() === "" || !selectedUser) return;

        // Send message to single user room
        socket.emit("sendMessage", {
            text: input,
            roomId: selectedUser.id,
        });

        // Show own message
        setMessage((prev) => [...prev, { text: input, from: "user" }]);
        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage(e);
        }
    };

    const handleUserClick = (user) => {
        console.log("Selected User:", user);
        setSelectedUser(user);

        // Clear chat history when switching user
        setMessage([]);

        // Join that room
        socket.emit("joinRoom", user.id);
        console.log(`Room joined: ${user.id}`);
    };

    return (
        <>
            <Card style={{ width: "30rem", height: "25rem", display: "flex", flexDirection: "column" }}>

                {/* Header: Fix alignment */}
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <SideBar onUserClick={handleUserClick} />
                    <AddNewUser/>
                    <span className="text-info">
                        {selectedUser ? selectedUser.username : "Chatbot"}
                    </span>
                    <CreateGroup/>
                </Card.Header>

                {/* Messages */}
                <Card.Body
                    style={{
                        overflowY: "auto",
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
                                marginLeft: msg.from === "user" ? "0" : "auto",
                                marginRight: msg.from === "user" ? "auto" : "0",
                                width: "fit-content"
                            }}
                        >
                            {msg.text}
                        </span>
                    ))}
                </Card.Body>

                {
                    selectedUser ?
                        <InputGroup className="p-2">
                            <Form.Control
                                placeholder="Type a message..."
                                value={input}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                            <Button variant="primary" onClick={handleSendMessage}>
                                Send
                            </Button>
                        </InputGroup> : <div className="d-inline-block px-4 py-2 fw-bold text-white bg-info bg-gradient rounded-3 shadow">
                            <span className="fs-4">Start the conversation</span>
                        </div>


                }

            </Card>
        </>
    );
}

export default ChatBox;
