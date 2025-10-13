import { render, screen, waitFor, act } from "@testing-library/react";
import SkillsPage from "../app/skills/page";
import "@testing-library/jest-dom";

// Mock getSeasonalBackground
jest.mock("../utils/getSeasonalBackground", () => ({
  __esModule: true,
  default: () => "/mock-bg.png",
}));

// Mock skills data
const mockSkills = [
  { id: 2, name: "Magic" },
  { id: 1, name: "Attack" },
  { id: 3, name: "Cooking" },
];

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockSkills),
    } as any)
  ) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("SkillsPage", () => {
  it("renders without crashing", async () => {
    await act(async () => {
      render(<SkillsPage />);
    });

    expect(screen.getByText(/skills/i)).toBeInTheDocument();
  });

  it("renders all skills from API", async () => {
    await act(async () => {
      render(<SkillsPage />);
    });

    await waitFor(() => {
      mockSkills.forEach((skill) => {
        expect(screen.getByText(new RegExp(skill.name, "i"))).toBeInTheDocument();
      });
    });
  });

  it("displays skills in alphabetical order", async () => {
    await act(async () => {
      render(<SkillsPage />);
    });

    await waitFor(() => {
      const renderedSkills = screen.getAllByRole("link");
      const renderedNames = renderedSkills.map((link) => link.textContent?.trim());
      const sortedNames = [...renderedNames].sort((a, b) => (a || "").localeCompare(b || ""));
      expect(renderedNames).toEqual(sortedNames);
    });
  });

  it("skill links point to correct URLs", async () => {
    await act(async () => {
      render(<SkillsPage />);
    });

    await waitFor(() => {
      mockSkills.forEach((skill) => {
        const link = screen.getByText(new RegExp(skill.name, "i")).closest("a");
        expect(link).toHaveAttribute("href", `/skills/${encodeURIComponent(skill.name)}`);
      });
    });
  });
});
