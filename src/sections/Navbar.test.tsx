import { render, screen, waitForElementToBeRemoved, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("opens and closes the mobile menu", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(screen.getByRole("button", { name: /close menu/i })).toHaveAttribute("aria-expanded", "true");
    const menu = screen.getByRole("navigation", { name: "Mobile" });
    expect(menu).toBeInTheDocument();
    // The page behind the menu is locked while it is open.
    expect(document.body.style.overflow).toBe("hidden");

    // Choosing a destination closes the menu and unlocks the page.
    await user.click(within(menu).getByRole("link", { name: "Projects" }));
    // The menu fades out before it unmounts.
    await waitForElementToBeRemoved(menu);
    expect(document.body.style.overflow).toBe("");
  });

  it("links every section", () => {
    render(<Navbar />);
    for (const id of ["about", "experience", "projects", "skills", "life", "contact"]) {
      expect(document.querySelector(`a[href="#${id}"]`), id).not.toBeNull();
    }
  });
});
