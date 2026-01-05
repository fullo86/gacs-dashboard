export async function POST(req) {
  const payload = await req.json();
  console.log("Notification received:", payload);
  // update status order di database
  return new Response("OK");
}
