import { useEffect, useRef, useState } from "react";

import GoogleButton from "../../components/GoogleButton.jsx";

import { books } from "../../books.js";
import { supabase, siteUrl } from "../../supabase.js";
import "./Auth.css";

const translations = {
  en: {
    back: "Back to Home",
    story: "Every book leaves a little memory.",
    storyText:
      "Give your stories a home, and keep the feelings between the pages.",
    loginTitle: "Welcome back",
    signupTitle: "A new chapter starts here",
    loginText: "Your reading memories are waiting for you.",
    signupText: "Create an account for your own little bookshelf.",
    name: "Display name",
    namePlaceholder: "What should we call you?",
    email: "Email address",
    password: "Password",
    confirm: "Confirm password",
    passwordHint: "Use at least 8 characters.",
    show: "Show",
    hide: "Hide",
    showPassword: "Show passwords",
    hidePassword: "Hide passwords",
    loginButton: "Log in",
    signupButton: "Create account",
    noAccount: "New to Reamo?",
    haveAccount: "Already have an account?",
    signupLink: "Sign up",
    loginLink: "Log in",
    mismatch: "Passwords do not match.",
    blankName: "Please enter a display name.",
    or: "or",
    working: "Please wait…",
    checkEmail:
      "Check your email for a link to confirm your account, then log in.",
    errors: {
      invalid_credentials: "Email or password is incorrect.",
      email_not_confirmed:
        "Confirm your email first. The link is in your inbox.",
      user_already_exists:
        "This email already has an account. Log in instead.",
      weak_password: "Choose a longer password that is harder to guess.",
      rate_limited: "Too many tries. Wait a few minutes, then try again.",
      google: "Google sign-in didn't start. Try again in a moment.",
      unknown: "Something went wrong. Try again in a moment.",
    },
  },

  th: {
    back: "กลับหน้า Home",
    story: "หนังสือทุกเล่ม ทิ้งความทรงจำไว้เสมอ",
    storyText:
      "ให้เรื่องราวมีบ้าน และเก็บความรู้สึกดี ๆ ระหว่างหน้าหนังสือ",
    loginTitle: "ยินดีต้อนรับกลับมา",
    signupTitle: "เริ่มต้นบทใหม่ด้วยกัน",
    loginText: "ความทรงจำจากการอ่านกำลังรอคุณอยู่",
    signupText: "สมัครสมาชิกเพื่อเริ่มชั้นหนังสือเล็ก ๆ ของคุณ",
    name: "ชื่อที่แสดง",
    namePlaceholder: "อยากให้เราเรียกคุณว่าอะไร?",
    email: "อีเมล",
    password: "รหัสผ่าน",
    confirm: "ยืนยันรหัสผ่าน",
    passwordHint: "ใช้รหัสผ่านอย่างน้อย 8 ตัวอักษร",
    show: "แสดง",
    hide: "ซ่อน",
    showPassword: "แสดงรหัสผ่าน",
    hidePassword: "ซ่อนรหัสผ่าน",
    loginButton: "เข้าสู่ระบบ",
    signupButton: "สมัครสมาชิก",
    noAccount: "เพิ่งมา Reamo ครั้งแรก?",
    haveAccount: "มีบัญชีอยู่แล้ว?",
    signupLink: "สมัครสมาชิก",
    loginLink: "เข้าสู่ระบบ",
    mismatch: "รหัสผ่านทั้งสองช่องไม่ตรงกัน",
    blankName: "กรุณากรอกชื่อที่แสดง",
    or: "หรือ",
    working: "กรุณารอสักครู่…",
    checkEmail:
      "เราส่งลิงก์ยืนยันบัญชีไปที่อีเมลของคุณแล้ว กดยืนยันแล้วค่อยเข้าสู่ระบบ",
    errors: {
      invalid_credentials: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      email_not_confirmed: "ยืนยันอีเมลก่อน ลิงก์อยู่ในกล่องจดหมายของคุณ",
      user_already_exists: "อีเมลนี้มีบัญชีอยู่แล้ว ไปที่หน้าเข้าสู่ระบบแทน",
      weak_password: "ตั้งรหัสผ่านให้ยาวขึ้นและเดายากขึ้น",
      rate_limited: "ลองหลายครั้งเกินไป รอสักครู่แล้วลองใหม่",
      google: "เปิดหน้าเข้าสู่ระบบด้วย Google ไม่สำเร็จ ลองใหม่อีกครั้ง",
      unknown: "เกิดข้อผิดพลาด ลองใหม่อีกครั้ง",
    },
  },
};

export default function AuthForm({ mode, language }) {
  const signup = mode === "signup";
  const t = translations[language] || translations.en;

  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const titleRef = useRef(null);
  const nameRef = useRef(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
  nameRef.current?.setCustomValidity("");
  confirmRef.current?.setCustomValidity("");
}, [language]);

  // Supabase error codes mapped to messages that say what to do next.
  function errorText(error) {
    const code = error?.code;

    if (code === "email_exists") return t.errors.user_already_exists;
    if (code?.startsWith("over_")) return t.errors.rate_limited;

    return t.errors[code] || t.errors.unknown;
  }

  function clearFeedback() {
    nameRef.current?.setCustomValidity("");
    confirmRef.current?.setCustomValidity("");
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    if (signup) {
      const displayName = String(data.get("displayName")).trim();

      nameRef.current.setCustomValidity(
        displayName ? "" : t.blankName,
      );

      confirmRef.current.setCustomValidity(
        data.get("password") === data.get("confirmPassword")
          ? ""
          : t.mismatch,
      );
    }

    if (!form.reportValidity()) return;

    const email = String(data.get("email")).trim();
    const password = String(data.get("password"));

    setBusy(true);
    setMessage("");

    try {
      if (signup) {
        // The password goes straight to Supabase Auth, which stores only a bcrypt hash.
        const { data: result, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: String(data.get("displayName")).trim() },
            emailRedirectTo: siteUrl,
          },
        });

        if (error) throw error;

        // With email confirmation on there is no session yet. Supabase also answers this way
        // for an email that already has an account, so the page never reveals which emails exist.
        if (!result.session) {
          form.reset();
          setMessage(t.checkEmail);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }

      setShowPassword(false);
    } catch (error) {
      setMessage(errorText(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-layout">
          <aside
            className="auth-story"
            aria-labelledby="auth-story-title"
          >
            <div className="auth-story-copy">
              <a className="auth-back" href="#home">
                <span aria-hidden="true">←</span>
                {t.back}
              </a>

              <h2 id="auth-story-title">{t.story}</h2>

              <p>{t.storyText}</p>
            </div>

            <div className="auth-shelf" aria-hidden="true">
              {books.map((book) => (
                <span
                  key={book.id}
                  style={{
                    "--spine-color": book.color,
                    flexGrow: book.width,
                    "--spine-height": `${book.height}px`,
                  }}
                />
              ))}
            </div>
          </aside>

          <section
            className="auth-card"
            aria-labelledby="auth-title"
          >
            <span className="auth-bookmark" aria-hidden="true" />

            <h1 id="auth-title" ref={titleRef} tabIndex={-1}>
              {signup ? t.signupTitle : t.loginTitle}
            </h1>

            <p className="auth-intro">
              {signup ? t.signupText : t.loginText}
            </p>

            <form
              onSubmit={handleSubmit}
              onInput={clearFeedback}
            >
              <div className={signup ? "auth-row" : undefined}>
                {signup && (
                  <div className="auth-field">
                    <label htmlFor="auth-name">{t.name}</label>

                    <input
                      id="auth-name"
                      name="displayName"
                      ref={nameRef}
                      required
                      maxLength={80}
                      autoComplete="nickname"
                      placeholder={t.namePlaceholder}
                    />
                  </div>
                )}

                <div className="auth-field">
                  <label htmlFor="auth-email">{t.email}</label>

                  <input
                    id="auth-email"
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className={signup ? "auth-row" : undefined}>
                <div className="auth-field">
                  <label htmlFor="auth-password">
                    {t.password}
                  </label>

                  <div className="auth-password">
                    <input
                      id="auth-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={signup ? 8 : undefined}
                      autoComplete={
                        signup ? "new-password" : "current-password"
                      }
                      aria-describedby={
                        signup ? "auth-password-hint" : undefined
                      }
                    />

                    <button
                      type="button"
                      aria-pressed={showPassword}
                      aria-label={
                        showPassword
                          ? t.hidePassword
                          : t.showPassword
                      }
                      onClick={() => {
                        setShowPassword((value) => !value);
                      }}
                    >
                      {showPassword ? t.hide : t.show}
                    </button>
                  </div>

                  {signup && (
                    <p
                      className="auth-hint"
                      id="auth-password-hint"
                    >
                      {t.passwordHint}
                    </p>
                  )}
                </div>

                {signup && (
                  <div className="auth-field">
                    <label htmlFor="auth-confirm">
                      {t.confirm}
                    </label>

                    <input
                      id="auth-confirm"
                      name="confirmPassword"
                      ref={confirmRef}
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                )}
              </div>

              <button
                className="auth-submit"
                type="submit"
                disabled={busy}
              >
                {busy
                  ? t.working
                  : signup
                    ? t.signupButton
                    : t.loginButton}
              </button>

              <p
                className="auth-status"
                role="status"
                aria-live="polite"
              >
                {message}
              </p>
            </form>

            <div className="auth-divider">
              <span>{t.or}</span>
            </div>

            <GoogleButton
              language={language}
              onError={() => setMessage(t.errors.google)}
            />

            <p className="auth-switch">
              {signup ? t.haveAccount : t.noAccount}{" "}

              <a href={signup ? "#login" : "#signup"}>
                {signup ? t.loginLink : t.signupLink}
              </a>
            </p>

          </section>
        </div>
      </div>
    </main>
  );
}