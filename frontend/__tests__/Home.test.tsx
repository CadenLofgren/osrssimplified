import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Home Page", () => {
  test("renders without crashing", () => {
    render(<Home />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  test("displays background video", () => {
    render(<Home />);
    const video = screen.getByTestId("background-video");
    expect(video).toBeInTheDocument();

  });

  test("shows credit to Melankola with correct link", () => {
    render(<Home />);
    const creditLink = screen.getByText(/melankola/i);
    expect(creditLink).toBeInTheDocument();
    expect(creditLink).toHaveAttribute("href", "https://www.youtube.com/watch?v=D7EGZDfTWO0");
  });
});
