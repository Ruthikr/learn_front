import Form from "../components/Form"

function Login() {
    return <Form route="/api/users/token/" method="login" />
}

export default Login