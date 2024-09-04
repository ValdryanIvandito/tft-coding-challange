export default async function handler(req, res) {
  const response = await fetch(process.env.DATA_NETWORK_ENDPOINT, {
    headers: {
      project_id: process.env.BLOCKFROST_PROJECT_ID,
    },
  });

  if (!response.ok) {
    return res.status(response.status).json({ error: "Failed to fetch data" });
  }

  const data = await response.json();
  res.status(200).json(data);
}
