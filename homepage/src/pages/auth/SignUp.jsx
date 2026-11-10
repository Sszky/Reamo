import AuthForm from "./Authform.jsx";

export default function SignUp({ language, returnTo }) {
  return <AuthForm mode="signup" language={language} returnTo={returnTo} />;
}