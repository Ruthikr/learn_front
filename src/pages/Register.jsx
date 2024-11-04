import Form from "../components/Form"
import { ACCESS_TOKEN } from "../constants"
function Register() {
    return <Form route="/api/users/register/" method="register" />
}

export default Register