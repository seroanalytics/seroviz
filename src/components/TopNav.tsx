import {Container, Nav, Navbar} from "react-bootstrap";
import ThemeSwitch from "./ThemeSwitch";
import React from "react";

interface Props {
    theme: string
    setTheme: (theme: string) => void
}

export default function TopNav({theme, setTheme}: Props) {
    return <Navbar expand="lg" className={"bg-light"}>
        <Container fluid>
            <img alt="SeroViz logo"
                 src={theme === "dark" ? "logolight.png": "logo.png"}
                 width={120}
                 className={"me-3"}></img>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto pt-4">
                    <Nav.Link href="/docs">Docs</Nav.Link>
                    <Nav.Link href="/">Upload dataset</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            <ThemeSwitch theme={theme} setTheme={setTheme}></ThemeSwitch>
        </Container>
    </Navbar>
}
