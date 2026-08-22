import { describe, expect, it, vi } from "vitest";
import { submitWeb3FormsContact } from "./web3forms";

const message = {
  name: "Avery Example",
  email: "avery@example.com",
  subject: "Project discussion",
  message: "I would like to discuss a project.",
  botcheck: false,
};

describe("Web3Forms contact delivery", () => {
  it("submits the supported payload to the Web3Forms endpoint", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));

    await submitWeb3FormsContact(message, "public-access-key", fetcher);

    expect(fetcher).toHaveBeenCalledWith("https://api.web3forms.com/submit", expect.objectContaining({ method: "POST" }));
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toMatchObject({ access_key: "public-access-key", botcheck: false });
  });

  it("does not attempt delivery without an access key", async () => {
    await expect(submitWeb3FormsContact(message, undefined)).rejects.toThrow("not configured");
  });

  it("shows a safe failure path when Web3Forms rejects a message", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false, message: "Rejected" }), { status: 400 }));

    await expect(submitWeb3FormsContact(message, "public-access-key", fetcher)).rejects.toThrow("Rejected");
  });
});
