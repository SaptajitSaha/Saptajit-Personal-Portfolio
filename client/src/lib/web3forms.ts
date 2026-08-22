export type ContactSubmission = {
  name: string;
  email: string;
  subject: string;
  message: string;
  botcheck: boolean;
};

type Web3FormsResponse = {
  success?: boolean;
  message?: string;
};

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export async function submitWeb3FormsContact(input: ContactSubmission, accessKey: string | undefined, fetcher: FetchLike = fetch) {
  if (!accessKey) throw new Error("Contact delivery is not configured.");

  const response = await fetcher("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      name: input.name,
      email: input.email,
      subject: `[Portfolio] ${input.subject}`,
      message: input.message,
      botcheck: input.botcheck,
    }),
  });
  if (response.redirected && response.url.includes("api.web3forms.com/submit/success")) return;

  const result = await response.json() as Web3FormsResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Unable to send your message.");
  }
}
