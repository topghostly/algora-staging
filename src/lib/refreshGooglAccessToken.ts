export async function refreshGoogleAccessToken(refresh_token: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
  });

  const data = await res.json();

  if (!res.ok) throw data;

  return {
    access_token: data.access_token,
    expires_at: Math.floor(Date.now() / 1000 + data.expires_in),
  };
}
