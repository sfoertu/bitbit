export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#071A33] py-6">
      <div className="mx-auto max-w-[1200px] px-6 text-center text-[12px] text-white/30">
        <p>&copy; {new Date().getFullYear()} BITBIT. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}
