import AuthForm from "./Authform.jsx";

export default function Login({ language, returnTo }) {
  return <AuthForm mode="login" language={language} returnTo={returnTo} />;
}