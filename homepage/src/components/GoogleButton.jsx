import { useEffect, useRef } from "react";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function GoogleButton({ language, onSuccess, onError }) {
  const boxRef = useRef(null);

  // เก็บ callback ไว้ใน ref เพื่อไม่ให้ useEffect ทำงานซ้ำทุกครั้งที่ parent render
  const cbRef = useRef({ onSuccess, onError });
  cbRef.current = { onSuccess, onError };

  useEffect(() => {
    if (!CLIENT_ID) {
      cbRef.current.onError("missing-client-id");
      return;
    }

    let cancelled = false;

    async function handleCredential(response) {
      try {
        const res = await fetch(API + "/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: response.credential }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || res.status);

        localStorage.setItem("accessToken", data.accessToken);
        cbRef.current.onSuccess(data.user);
      } catch (error) {
        cbRef.current.onError(error.message);
      }
    }

    // script ของ Google โหลดแบบ async จึงต้องรอจนกว่าจะพร้อม
    function start() {
      if (cancelled) return;

      if (!window.google?.accounts?.id) {
        setTimeout(start, 100);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredential,
      });

      window.google.accounts.id.renderButton(boxRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width: 320,
        locale: language,
      });
    }

    start();

    return () => {
      cancelled = true;
    };
  }, [language]);

  return <div className="auth-google" ref={boxRef} />;
}
