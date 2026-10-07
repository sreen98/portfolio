import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Contact from "./Contact";
import { profile } from "../data/resume";

describe("Contact", () => {
  it("opens the mail app from the email button", () => {
    render(<Contact />);
    const email = screen.getByRole("link", { name: /email me|sreenath\.premnath/i });
    expect(email).toHaveAttribute("href", `mailto:${profile.email}`);
  });

  it("dials the phone number", () => {
    render(<Contact />);
    const phone = screen.getByRole("link", { name: (name) => name.includes(profile.phone) });
    expect(phone).toHaveAttribute("href", `tel:${profile.phone.replace(/-/g, "")}`);
  });

  it.each(["LinkedIn", "GitHub", "Instagram", "Medium"])("opens %s in a new tab", (label) => {
    render(<Contact />);
    const link = screen.getByRole("link", { name: new RegExp(label) });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(link.getAttribute("href")).toMatch(/^https:\/\//);
  });

  it("downloads the resume", () => {
    render(<Contact />);
    const resume = screen.getByRole("link", { name: /resume \(pdf\)/i });
    expect(resume).toHaveAttribute("href", profile.resume);
    expect(resume).toHaveAttribute("download");
  });

  it("copies the email address and confirms it", async () => {
    const user = userEvent.setup();
    render(<Contact />);
    await user.click(screen.getByRole("button", { name: /copy email address/i }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/copied/i));
    await expect(navigator.clipboard.readText()).resolves.toBe(profile.email);
  });
});
