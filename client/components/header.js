import Link from "next/link";

const PageHeader = ({currentUser}) => {
    const links = [
        !currentUser && {label: "Sign up", href: "/auth/signup"},
        !currentUser && {label: "Sign in", href: "/auth/signin"},
        currentUser && {label: "Sign out", href: "/auth/signout"},
    ].filter(link => link) //return the link that results in "true"
     .map(({label, href}) => {
        return <li key={href} className="nav-item">
            <Link href={href} className="nav-link">
                {label}
            </Link>
        </li>
     })

    return <nav className="navbar navbar-light bg-light">
        <Link href="/" className="navbar-brand">Ticket App</Link>

        <div className="d-flex justify-content-end">
            <ul className="nav d-flex align-items-center">
                {links}
            </ul>
        </div>
    </nav>
}

export default PageHeader;