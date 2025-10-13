// __tests__/SkillDetailsClient.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import SkillDetailsClient from "../app/skills/[skill]/SkillDetailsClient";

// ------------------------
// ✅ Mock dependencies
// ------------------------

// Mock seasonal background
jest.mock("../utils/getSeasonalBackground", () => ({
  __esModule: true,
  default: () => "/mock-bg.png",
}));

// Mock react-markdown to just render children
jest.mock("react-markdown", () => (props: any) => <div>{props.children}</div>);

// Mock fetch API
const mockSkillVersions = [
  {
    id: 1,
    name: "Attack",
    category: "f2p",
    summary: "### Level 1–20\nTrain on **chickens**.",
  },
  {
    id: 2,
    name: "Attack",
    category: "p2p",
    summary: "### Level 20–40\nTrain on **Hill Giants**.",
  },
];

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockSkillVersions),
    } as any)
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

// ------------------------
// ✅ Test cases
// ------------------------

describe("SkillDetailsClient", () => {
  test("renders without crashing", async () => {
    render(<SkillDetailsClient skill="Attack" />);

    expect(await screen.findByText("Attack")).toBeInTheDocument();
  });

  test("renders F2P and P2P tabs and switches active tab", async () => {
    render(<SkillDetailsClient skill="Attack" />);

    // Wait for tabs to render
    const f2pTab = await screen.findByText("F2P");
    const p2pTab = await screen.findByText("P2P");

    expect(f2pTab).toBeInTheDocument();
    expect(p2pTab).toBeInTheDocument();

    // Initially, F2P tab is active
    expect(f2pTab).toHaveClass("bg-[#2b220f]");

    // Click P2P tab
    fireEvent.click(p2pTab);

    // Now P2P should be active
    expect(p2pTab).toHaveClass("bg-[#2b220f]");
  });

  test("renders skill summary for active tab", async () => {
    render(<SkillDetailsClient skill="Attack" />);

    expect(await screen.findByText("Train on")).toBeInTheDocument();
    expect(screen.getByText("chickens")).toBeInTheDocument();
  });

  test("shows fallback text if no summary is available", async () => {
    // Mock fetch returning empty array
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve([]),
    } as any);

    render(<SkillDetailsClient skill="Nonexistent" />);

    expect(
      await screen.findByText("No summary available for this skill.")
    ).toBeInTheDocument();
  });
});
