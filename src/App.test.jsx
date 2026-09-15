import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import App from "./App";

// A real backend only returns the user from /auth/me once a valid bearer
// token is presented, so the mock checks the Authorization header instead
// of a static "am I logged in" flag -- that's what actually exercises the
// login -> token stored -> token sent on the next request flow.
function mockFetch() {
  globalThis.fetch = vi.fn((url, opts = {}) => {
    const path = String(url).replace(/^https?:\/\/[^/]+/, "");
    const authed = opts.headers?.Authorization === "Bearer fake-token";

    if (path === "/auth/me") {
      if (authed) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ id: 1, email: "admin@impactproject.org", role: "admin", volunteer_id: null, beneficiary_id: null }),
        });
      }
      return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({ detail: "Could not validate credentials" }) });
    }

    if (path === "/auth/login") {
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ access_token: "fake-token", token_type: "bearer" }) });
    }

    if (["/volunteers", "/beneficiaries", "/matches"].includes(path)) {
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) });
    }

    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) });
  });
}

// The nav's "Sign in" button has an exact accessible name; the landing
// page's hero/CTA buttons say "Staff sign in" instead, so this regex
// doesn't accidentally match those.
const navSignIn = () => screen.getByRole("button", { name: /^sign in$/i });

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("shows the landing page (not a bare login form) when signed out", () => {
    mockFetch();
    render(<App />);

    expect(screen.getByRole("heading", { name: /real support, matched to real need/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
  });

  test("sign in from the landing page reveals the login form", () => {
    mockFetch();
    render(<App />);

    fireEvent.click(navSignIn());

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test("logging in reveals the dashboard", async () => {
    mockFetch();
    render(<App />);

    fireEvent.click(navSignIn());
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "admin@impactproject.org" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "admin123" } });
    fireEvent.click(navSignIn());

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /overview/i })).toBeInTheDocument();
    });
    expect(localStorage.getItem("ip_token")).toBe("fake-token");
  });

  test("an invalid login shows an error instead of the dashboard", async () => {
    globalThis.fetch = vi.fn((url) => {
      const path = String(url).replace(/^https?:\/\/[^/]+/, "");
      if (path === "/auth/login") {
        return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({ detail: "Incorrect email or password" }) });
      }
      return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({ detail: "unauthorized" }) });
    });

    render(<App />);
    fireEvent.click(navSignIn());
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "wrong@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "nope" } });
    fireEvent.click(navSignIn());

    await waitFor(() => {
      expect(screen.getByText(/incorrect email or password/i)).toBeInTheDocument();
    });
    expect(screen.queryByRole("heading", { name: /overview/i })).not.toBeInTheDocument();
  });
});
