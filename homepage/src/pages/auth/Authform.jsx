import { useEffect, useRef, useState } from "react";

import "./Auth.css";

const translations = {
  en: {
    back: "Back to Home",
    eyebrow: "YOUR LITTLE READING CORNER",
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
    preview:
      "Frontend preview: your details passed the form checks. No account was created and you have not been logged in.",
    previewLabel:
      "Preview only — account services are not connected yet.",
  },

  th: {
    back: "กลับหน้า Home",
    eyebrow: "มุมอ่านหนังสือเล็ก ๆ ของคุณ",
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
    preview:
      "ตัวอย่าง Frontend: ข้อมูลผ่านการตรวจฟอร์มแล้ว ยังไม่ได้สร้างบัญชีหรือเข้าสู่ระบบจริง",
    previewLabel: "โหมดตัวอย่าง — ยังไม่ได้เชื่อมระบบบัญชี",
  },
};

export default function AuthForm({ mode, language }) {
  const signup = mode === "signup";
  const t = translations[language] || translations.en;

  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  function clearFeedback() {
    nameRef.current?.setCustomValidity("");
    confirmRef.current?.setCustomValidity("");
    setSubmitted(false);
  }

  function handleSubmit(event) {
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

    // Add the Backend API request here when it is ready.
    // This preview does not store or send credentials.
    setSubmitted(true);
    form.reset();
    setShowPassword(false);
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <a className="auth-back" href="#home">
          <span aria-hidden="true">←</span>
          {t.back}
        </a>

        <div className="auth-layout">
          <aside
            className="auth-story"
            aria-labelledby="auth-story-title"
          >
            <div className="auth-story-copy">
              <p className="auth-eyebrow">{t.eyebrow}</p>

              <h2 id="auth-story-title">{t.story}</h2>

              <p>{t.storyText}</p>
            </div>

            <div className="auth-scene" aria-hidden="true" />

            
          </aside>

          <section
            className="auth-card"
            aria-labelledby="auth-title"
          >
            <span className="auth-bookmark" aria-hidden="true" />

            <p className="auth-wordmark">REAMO</p>

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

              <button className="auth-submit" type="submit">
                {signup ? t.signupButton : t.loginButton}
                <span aria-hidden="true">→</span>
              </button>

              <p
                className="auth-status"
                role="status"
                aria-live="polite"
              >
                {submitted ? t.preview : ""}
              </p>
            </form>

            <p className="auth-switch">
              {signup ? t.haveAccount : t.noAccount}{" "}

              <a href={signup ? "#login" : "#signup"}>
                {signup ? t.loginLink : t.signupLink}
              </a>
            </p>

            <p className="auth-preview-label">
              {t.previewLabel}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}