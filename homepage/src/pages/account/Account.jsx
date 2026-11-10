import "./Account.css";

const translations = {
  en: {
    title: "Account",
    card: "Reamo reader's card",
    name: "Name",
    username: "Username",
    memberSince: "Member since",
    books: "Books",
    shelves: "Shelves",
    memories: "Memories",
    countsLater: "Counts appear once your shelves are saved.",
    profile: "Profile",
    displayName: "Display name",
    usernameHint: "3 to 20 characters: lowercase letters, numbers or _",
    usernameInvalid: "Use 3 to 20 lowercase letters, numbers or _.",
    profileLink: "Your public shelves will live at",
    save: "Save profile",
    signIn: "Sign-in",
    email: "Email",
    password: "Password",
    resetPassword: "Send a reset link",
    google: "Google",
    googlePending: "Not available yet",
    logOut: "Log out",
    deleteTitle: "Delete account",
    deleteText: "Removes your profile, shelves and memories for good.",
    deleteButton: "Delete my account",
    noUsername: "not set yet",
  },
  th: {
    title: "บัญชีของฉัน",
    card: "บัตรนักอ่าน Reamo",
    name: "ชื่อ",
    username: "ชื่อผู้ใช้",
    memberSince: "เป็นสมาชิกตั้งแต่",
    books: "หนังสือ",
    shelves: "ชั้น",
    memories: "ความทรงจำ",
    countsLater: "ตัวเลขจะขึ้นเมื่อระบบบันทึกชั้นหนังสือพร้อมใช้งาน",
    profile: "โปรไฟล์",
    displayName: "ชื่อที่แสดง",
    usernameHint: "3 ถึง 20 ตัว ใช้ได้เฉพาะ a-z ตัวเล็ก ตัวเลข และ _",
    usernameInvalid: "ใช้ a-z ตัวเล็ก ตัวเลข หรือ _ ความยาว 3 ถึง 20 ตัว",
    profileLink: "ชั้นหนังสือสาธารณะของคุณจะอยู่ที่",
    save: "บันทึกโปรไฟล์",
    signIn: "การเข้าสู่ระบบ",
    email: "อีเมล",
    password: "รหัสผ่าน",
    resetPassword: "ส่งลิงก์ตั้งรหัสผ่านใหม่",
    google: "Google",
    googlePending: "ยังไม่เปิดใช้งาน",
    logOut: "ออกจากระบบ",
    deleteTitle: "ลบบัญชี",
    deleteText: "ลบโปรไฟล์ ชั้นหนังสือ และความทรงจำทั้งหมดอย่างถาวร",
    deleteButton: "ลบบัญชีของฉัน",
    noUsername: "ยังไม่ได้ตั้ง",
  },
};

const usernamePattern = "[a-z0-9_]{3,20}";

function formatDate(value, language) {
  return new Date(value).toLocaleDateString(language === "th" ? "th-TH" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Account({ language, user, onLogOut, onUnavailable }) {
  const t = translations[language] || translations.en;

  // Only signed-in readers reach this page (App sends everyone else to log in).
  const reader = user;

  function saveProfile(event) {
    event.preventDefault();
    const input = event.currentTarget.elements.username;
    input.setCustomValidity(input.validity.patternMismatch ? t.usernameInvalid : "");
    if (!event.currentTarget.reportValidity()) return;
    onUnavailable();
  }

  return (
    <main className="account">
      <h1 className="account-title">{t.title}</h1>

      <div className="account-layout">
        <section className="reader-card" aria-labelledby="reader-card-title">
          <h2 id="reader-card-title">{t.card}</h2>

          <div className="reader-card-top">
            {reader.avatarUrl ? (
              <img
                className="reader-avatar"
                src={reader.avatarUrl}
                alt=""
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="reader-avatar" aria-hidden="true">
                {reader.name.trim().charAt(0).toUpperCase()}
              </span>
            )}

            <div>
              <p className="reader-name">{reader.name}</p>
              <p className="reader-username">
                {reader.username ? `@${reader.username}` : t.noUsername}
              </p>
            </div>
          </div>

          <dl className="card-rows">
            <div>
              <dt>{t.memberSince}</dt>
              <dd>{formatDate(reader.joined, language)}</dd>
            </div>
            <div>
              <dt>{t.books}</dt>
              <dd>–</dd>
            </div>
            <div>
              <dt>{t.shelves}</dt>
              <dd>–</dd>
            </div>
            <div>
              <dt>{t.memories}</dt>
              <dd>–</dd>
            </div>
          </dl>

          <p className="card-note">{t.countsLater}</p>
        </section>

        <div className="account-settings">
          <form
            className="settings-section"
            key={language}
            onSubmit={saveProfile}
            noValidate
          >
            <h2>{t.profile}</h2>

            <label htmlFor="account-name">{t.displayName}</label>
            <input
              id="account-name"
              name="displayName"
              defaultValue={reader.name}
              maxLength={80}
              required
            />

            <label htmlFor="account-username">{t.username}</label>
            <div className="username-field">
              <span aria-hidden="true">@</span>
              <input
                id="account-username"
                name="username"
                defaultValue={reader.username || ""}
                pattern={usernamePattern}
                maxLength={20}
                autoCapitalize="none"
                spellCheck={false}
                required
                aria-describedby="username-hint"
                onInput={(event) => event.currentTarget.setCustomValidity("")}
              />
            </div>
            <p className="field-hint" id="username-hint">
              {t.usernameHint}
            </p>

            <button className="button-primary" type="submit">
              {t.save}
            </button>
          </form>

          <section className="settings-section" aria-labelledby="signin-title">
            <h2 id="signin-title">{t.signIn}</h2>

            <dl className="settings-rows">
              <div>
                <dt>{t.email}</dt>
                <dd>{reader.email}</dd>
              </div>
              <div>
                <dt>{t.password}</dt>
                <dd>
                  <button className="text-link" type="button" onClick={onUnavailable}>
                    {t.resetPassword}
                  </button>
                </dd>
              </div>
              <div>
                <dt>{t.google}</dt>
                <dd className="muted">{t.googlePending}</dd>
              </div>
            </dl>

            <button className="logout-button" type="button" onClick={onLogOut}>
              {t.logOut}
            </button>
          </section>

          <section className="settings-section danger-zone" aria-labelledby="delete-title">
            <h2 id="delete-title">{t.deleteTitle}</h2>
            <p>{t.deleteText}</p>
            <button className="danger-button" type="button" onClick={onUnavailable}>
              {t.deleteButton}
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
