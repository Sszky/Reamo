export default function Footer({ compact = false }) {
  return (
    <footer className={compact ? "footer-compact" : undefined}>
      <div className="footer-hem">
        <p>@2026 sszky</p>
      </div>
    </footer>
  );
}
