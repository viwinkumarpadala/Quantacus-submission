import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function NavBar() {
    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home">Quantacus-Assignment</Navbar.Brand>
                </Container>
            </Navbar>
            <br />

        </>
    );
}

export default NavBar;