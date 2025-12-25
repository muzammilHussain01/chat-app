// SideBar.jsx
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";

const users = [
    {
        id: 1,
        username: "Muzammil Hussain",
        email: "muzammil@example.com",
        status: "online",
        avatar: "https://ui-avatars.com/api/?name=Muzammil",
    },
    {
        id: 2,
        username: "Ayaan Khan",
        email: "ayaan@example.com",
        status: "offline",
        avatar: "https://ui-avatars.com/api/?name=Ayaan",
    },
    {
        id: 3,
        username: "Rehan Ali",
        email: "rehan@example.com",
        status: "online",
        avatar: "https://ui-avatars.com/api/?name=Rehan",
    },
    {
        id: 4,
        username: "Zoya Sheikh",
        email: "zoya@example.com",
        status: "away",
        avatar: "https://ui-avatars.com/api/?name=Zoya",
    },
    {
        id: 5,
        username: "Fatima Noor",
        email: "fatima@example.com",
        status: "offline",
        avatar: "https://ui-avatars.com/api/?name=Fatima",
    },
];
export {users};

function SideBar({ onUserClick }) {
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(users);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        setFilteredUsers(
            users.filter((u) =>
                u.username.toLowerCase().includes(value.toLowerCase())
            )
        );
    };

    const handleListClick = (user) => {
        onUserClick(user); // send user to parent
        handleClose();     // close sidebar automatically (fixed)
    };

    return (
        <>
            <Button variant="outline-info" onClick={handleShow}>
                Users
            </Button>

            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Users</Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    {/* Search box */}
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Search user"
                            value={search}
                            onChange={handleChange}
                        />
                        <InputGroup.Text style={{ cursor: "pointer" }}>
                            <PersonSearchIcon />
                        </InputGroup.Text>
                    </InputGroup>

                    {/* Users list */}
                    <ListGroup>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((u) => (
                                <ListGroup.Item
                                    key={u.id}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleListClick(u)}
                                    className="d-flex justify-content-between align-items-start"
                                >
                                    <div className="ms-2 me-auto d-flex align-items-center">
                                        <Image
                                            src={u.avatar}
                                            style={{ width: "40px", height: "40px", marginRight: "15px" }}
                                            roundedCircle
                                        />
                                        <div>
                                            <strong>{u.username}</strong>
                                            <div style={{ fontSize: "12px", color: "gray" }}>
                                                {u.email}
                                            </div>
                                        </div>
                                    </div>

                                    <Badge bg="primary" pill>
                                        14
                                    </Badge>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <div>No users found</div>
                        )}
                    </ListGroup>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default SideBar;
