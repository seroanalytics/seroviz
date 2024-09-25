import {Nav, Pagination} from "react-bootstrap";

interface Props {
    currentPage: number;
    numPages: number;
    setPage: (num: number) => void;
}

export default function PageNav({currentPage, numPages, setPage}: Props) {
    let items = [];
    for (let number = 1; number <= numPages; number++) {
        items.push(
            <Pagination.Item key={number} active={number === currentPage}
                             onClick={() => setPage(number)}>
                {number}
            </Pagination.Item>,
        );
    }
    return <Nav>
            <Pagination size={"sm"} className={"justify-content-center"}>
                {items}
            </Pagination>
        </Nav>
}
