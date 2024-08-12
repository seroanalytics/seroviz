import {Container, Nav, Navbar} from "react-bootstrap";
import ThemeSwitch from "./ThemeSwitch";
import React from "react";

interface Props {
    theme: string
    setTheme: (theme: string) => void
}

export default function TopNav({theme, setTheme}: Props) {
    return <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
            <Navbar.Brand>SeroViz</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/docs">Docs</Nav.Link>
                    <Nav.Link href="/">Choose dataset</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            <ThemeSwitch theme={theme} setTheme={setTheme}></ThemeSwitch>
        </Container>
    </Navbar>
}
