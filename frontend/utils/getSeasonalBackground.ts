// utils/getSeasonalBackground.ts
export default function getSeasonalBackground() {
  const today = new Date();
  const month = today.getMonth() + 1; // 1–12
  const day = today.getDate();

  // 🎃 Halloween theme (Oct 1–31)
  if (month === 10 && day >= 1 && day <= 31) {
    return "/images/skills-bg-halloween.png";
  }

  // 🎄 Christmas theme (Nov 28–Jan 5)
  if ((month === 11 && day >= 28) || month === 12 || (month === 1 && day <= 5)) {
    return "/images/skills-bg-christmas.png";
  }

  // Default
  return "/images/skills-bg.png";
}
