import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Dropdown from "react-bootstrap/Dropdown";
import AddIcon from "@mui/icons-material/Add";
import Groups2Icon from "@mui/icons-material/Groups2";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { users } from "./components/SideBar.jsx";
import axios from "axios"

function CreateGroup() {
    const [inputValue, setInputValue] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    /* ---------------- ADD USER VIA + BUTTON ---------------- */
    const handleAddUserToGroup = () => {
        if (!inputValue.trim()) return;

        const found = users.find(
            u => u.username.toLowerCase() === inputValue.toLowerCase()
        );
        if (!found) return;

        if (!selectedUsers.some(u => u.id === found.id)) {
            setSelectedUsers(prev => [...prev, found]);
        }

        setInputValue("");
        setFilteredUsers(users);
        setIsDropdownOpen(false);
    };

    /* ---------------- FILTER USERS ---------------- */
    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (!value.trim()) {
            setFilteredUsers(users);
            setIsDropdownOpen(false);
            return;
        }

        const filtered = users.filter(u =>
            u.username.toLowerCase().includes(value.toLowerCase())
        );

        setFilteredUsers(filtered);
        setIsDropdownOpen(true);
    };

    /* ---------------- SELECT FROM DROPDOWN ---------------- */
    const handleSelectUser = (u) => {
        if (!selectedUsers.some(s => s.id === u.id)) {
            setSelectedUsers(prev => [...prev, u]);
        }

        setInputValue("");
        setFilteredUsers(users);
        setIsDropdownOpen(false);
    };

    /* ---------------- REMOVE CHIP ---------------- */
    const handleDeleteChip = (id) => {
        setSelectedUsers(prev => prev.filter(u => u.id !== id));
    };

    /* ---------------- CREATE GROUP ---------------- */
    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            alert("Please enter a group name");
            return;
        }

        if (selectedUsers.length === 0) {
            alert("Please add at least one user");
            return;
        }

        const groupData = {
            type: "group",
            groupName: groupName,
            members: selectedUsers,
        };

        console.log("✅ Group Created:", groupData);
        try {
            const response = await axios.post("http://localhost:5000/api/users",groupData);
            console.log("Response from the server is ", response)
        }catch (e) {
            console.log(e.message)
        }

        // Reset state
        setGroupName("");
        setSelectedUsers([]);
        setInputValue("");
        setFilteredUsers(users);
        setIsDropdownOpen(false);

        setShowModal(false);
        setShowToast(true);
    };

    return (
        <>
            {/* ---------------- TOAST ---------------- */}
            <ToastContainer position="top-center" className="p-3">
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide
                    bg="transparent"
                    className= "border-0 shadow-none"
                >
                    <Toast.Body className="text-success">
                        Group created successfully 🎉
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            {/* ---------------- TRIGGER ---------------- */}
            <span
                className="text-info fw-semibold"
                style={{ cursor: "pointer" }}
                onClick={handleShow}
            >
                Create Group
            </span>

            {/* ---------------- MODAL ---------------- */}
            <Modal
                show={showModal}
                onHide={handleClose}
                centered
                backdrop="static"
                contentClassName="border-0 rounded-4 shadow-lg"
            >
                {/* HEADER */}
                <Modal.Header className="border-0 pb-0">
                    <div>
                        <Modal.Title className="fw-bold fs-4">
                            Create New Group
                        </Modal.Title>
                        <small className="text-muted">
                            Add group name and members
                        </small>
                    </div>
                </Modal.Header>

                {/* BODY */}
                <Modal.Body className="pt-3">
                    {/* SELECTED USERS */}
                    {selectedUsers.length > 0 && (
                        <>
                            <div className="fw-semibold text-muted mb-2">
                                Group Members
                            </div>
                            <Stack
                                direction="row"
                                spacing={1}
                                className="flex-wrap mb-4"
                            >
                                {selectedUsers.map(u => (
                                    <Chip
                                        key={u.id}
                                        label={u.username}
                                        className="bg-success text-white shadow-sm"
                                        onDelete={() => handleDeleteChip(u.id)}
                                    />
                                ))}
                            </Stack>
                        </>
                    )}

                    {/* GROUP NAME */}
                    <div className="fw-semibold text-muted mb-2">
                        Group Name
                    </div>
                    <InputGroup className="mb-4 shadow-sm rounded">
                        <InputGroup.Text className="bg-light border-0">
                            <Groups2Icon color="primary" />
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Enter group name"
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                            className="border-0"
                        />
                    </InputGroup>

                    {/* ADD MEMBERS */}
                    <div className="fw-semibold text-muted mb-2">
                        Add Members
                    </div>
                    <InputGroup className="shadow-sm rounded">
                        <Dropdown show={isDropdownOpen} className="w-100">
                            <Dropdown.Toggle
                                as={Form.Control}
                                placeholder="Search users..."
                                value={inputValue}
                                onChange={handleChange}
                                onClick={() => setIsDropdownOpen(true)}
                                className="border-0"
                                style={{ cursor: "text" }}
                            />

                            <Dropdown.Menu className="w-100 shadow-sm border-0">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(u => (
                                        <Dropdown.Item
                                            key={u.id}
                                            onClick={() => handleSelectUser(u)}
                                            className="py-2"
                                        >
                                            {u.username}
                                        </Dropdown.Item>
                                    ))
                                ) : (
                                    <Dropdown.Item disabled>
                                        No user found
                                    </Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>

                        <Button
                            variant="primary"
                            className="px-3"
                            onClick={handleAddUserToGroup}
                        >
                            <AddIcon />
                        </Button>
                    </InputGroup>
                </Modal.Body>

                {/* FOOTER */}
                <Modal.Footer className="border-0 pt-0">
                    <Button
                        variant="light"
                        className="px-4"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        className="px-4 fw-semibold"
                        onClick={handleCreateGroup}
                        disabled={!groupName || selectedUsers.length === 0}
                    >
                        Create Group
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CreateGroup;
