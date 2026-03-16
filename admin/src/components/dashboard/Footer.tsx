export function Footer() {
  return (
    <footer className="flex items-center justify-between border-t border-[#E4EAF1] bg-white px-5 py-3">
      <p className="text-[11px] text-[#8896A6]">
        Copyright &copy; 2024 Peterdraw
      </p>
      <div className="flex items-center gap-4">
        {["Privacy Policy", "Term and conditions", "Contact"].map((t) => (
          <a
            key={t}
            href="#"
            className="text-[11px] text-[#8896A6] transition hover:text-[#5A6E82]"
          >
            {t}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {[
          <svg key="fb" width="12" height="12" viewBox="0 0 24 24" fill="#8896A6"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
          <svg key="x" width="12" height="12" viewBox="0 0 24 24" fill="#8896A6"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
          <svg key="ig" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8896A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
          <svg key="yt" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8896A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 010-10 2 2 0 011.4-1.4 49.56 49.56 0 0116.2 0A2 2 0 0121.5 7a24.12 24.12 0 010 10 2 2 0 01-1.4 1.4 49.55 49.55 0 01-16.2 0A2 2 0 012.5 17"/><path d="M10 15l5-3-5-3z"/></svg>,
          <svg key="li" width="12" height="12" viewBox="0 0 24 24" fill="#8896A6"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
        ].map((icon, i) => (
          <button
            key={i}
            className="flex h-[24px] w-[24px] items-center justify-center rounded-full border border-[#E4EAF1] transition hover:bg-[#F0F4F8]"
          >
            {icon}
          </button>
        ))}
      </div>
    </footer>
  )
}
