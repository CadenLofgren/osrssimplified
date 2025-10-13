import { render, screen } from "@testing-library/react";
import AboutPage from "@/app/about/page";

// Mock seasonal background
jest.mock("@/utils/getSeasonalBackground", () => ({
  __esModule: true,
  default: () => "/mock-bg.png",
}));

describe("About Page", () => {
  beforeEach(() => {
    render(<AboutPage />);
  });

  it("renders without crashing", () => {
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders main heading", () => {
    const heading = screen.getByRole("heading", { name: /About OSRS Simplified/i });
    expect(heading).toBeInTheDocument();
  });

  it("renders sections with titles", () => {
    const sections = [
      "What is OSRS Simplified?",
      "How It Was Made",
      "Credits",
      "Links",
    ];
    sections.forEach((title) => {
      expect(screen.getByRole("heading", { name: new RegExp(title, "i") })).toBeInTheDocument();
    });
  });

  it("renders description text", () => {
    const description = screen.getByText(/OSRS Simplified is a project with the sole purpose/i);
    expect(description).toBeInTheDocument();
  });

  it("renders all external links correctly", () => {
    // OSRS Wiki API link
    const wikiLink = screen.getByRole("link", { name: /OSRS Wiki API/i });
    expect(wikiLink).toHaveAttribute(
      "href",
      "https://runescape.wiki/w/Application_programming_interface"
    );

    // Melankola YouTube link
    const melankola = screen.getByRole("link", { name: /Melankola/i });
    expect(melankola).toHaveAttribute(
      "href",
      "https://www.youtube.com/watch?v=D7EGZDfTWO0"
    );

    // GitHub links (text + logo)
    const githubLinks = screen.getAllByRole("link", { name: /GitHub/i });
    githubLinks.forEach((link) => {
      expect(link).toHaveAttribute(
        "href",
        "https://github.com/CadenLofgren/osrssimplified"
      );
    });

    // OSRS Wiki logo link
    const osrsWikiLogo = screen.getByAltText("OSRS Wiki");
    expect(osrsWikiLogo.closest("a")).toHaveAttribute(
      "href",
      "https://oldschool.runescape.wiki/"
    );
  });

  it("renders tech stack images", () => {
    const techImages = ["Next.js", "FastAPI", "PostgreSQL"];
    techImages.forEach((alt) => {
      const img = screen.getByAltText(alt);
      expect(img).toBeInTheDocument();
    });
  });
});
