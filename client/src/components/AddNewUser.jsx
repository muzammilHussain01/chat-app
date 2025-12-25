import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

function AddNewUser() {
    const [show, setShow] = useState(false);

    const [form, setForm] = useState({
        username: "",
        email: "",
        status: "online",
    });

    const [avatar, setAvatar] = useState(null);

    /* ---------------- HANDLE INPUT CHANGE ---------------- */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };


    /* ---------------- HANDLE FILE ---------------- */
    const handleFileChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    /* ---------------- HANDLE SUBMIT ---------------- */
    const handleSubmit = async () => {
        if (!form.username || !form.email) return;

        try {
            const payload = {
                ...form,
                avatar,
            };

            const formData = new FormData();

            Object.entries(payload).forEach(([key, value]) => {
                if (value !== null) {
                    formData.set(key, value);
                }
            });

            console.log(avatar.name);

            await axios.post("http://localhost:5000/api/single_user", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setShow(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShow(true)}
            >
                + Add User
            </Button>

            <Modal
                show={show}
                onHide={() => setShow(false)}
                centered
                backdrop="static"
                contentClassName="border-0"
            >
                <div
                    style={{
                        background: "#f5f7fa",
                        padding: "16px",
                        borderRadius: "12px",
                    }}
                >
                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: "10px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                        }}
                    >
                        {/* HEADER */}
                        <div
                            style={{
                                background: "#0d6efd",
                                color: "#fff",
                                padding: "10px 14px",
                                borderTopLeftRadius: "10px",
                                borderTopRightRadius: "10px",
                                fontWeight: 600,
                                fontSize: "14px",
                            }}
                        >
                            Add New User
                        </div>

                        {/* BODY */}
                        <div style={{ padding: "14px" }}>
                            <Form>
                                <Form.Group className="mb-2">
                                    <Form.Label className="small text-muted">
                                        Username
                                    </Form.Label>
                                    <Form.Control
                                        size="sm"
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-2">
                                    <Form.Label className="small text-muted">
                                        Email
                                    </Form.Label>
                                    <Form.Control
                                        size="sm"
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Row className="mb-2">
                                    <Col>
                                        <Form.Label className="small text-muted">
                                            Status
                                        </Form.Label>
                                        <Form.Select
                                            size="sm"
                                            name="status"
                                            value={form.status}
                                            onChange={handleChange}
                                        >
                                            <option value="online">Online</option>
                                            <option value="away">Away</option>
                                            <option value="offline">Offline</option>
                                        </Form.Select>
                                    </Col>

                                    <Col>
                                        <Form.Label className="small text-muted">
                                            Avatar
                                        </Form.Label>
                                        <Form.Control
                                            size="sm"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </Col>
                                </Row>
                            </Form>
                        </div>

                        {/* FOOTER */}
                        <div
                            style={{
                                padding: "10px 14px",
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "8px",
                                borderTop: "1px solid #eee",
                            }}
                        >
                            <Button
                                size="sm"
                                variant="light"
                                onClick={() => setShow(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                variant="primary"
                                disabled={!form.username || !form.email}
                                onClick={handleSubmit}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default AddNewUser;
