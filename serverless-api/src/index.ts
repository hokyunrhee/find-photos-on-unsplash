interface ENV {
  ACCESS_KEY: string;
}

type UnsplashResponse = {
  results: { id: number; urls: { small: string }; links: { html: string } }[];
};

const corsHeaders = {
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET",
  "Access-Control-Allow-Origin": "*",
};

export default {
  async fetch(request: Request, env: ENV): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response("OK", { headers: corsHeaders });
    }

    if (request.method === "GET") {
      return getImages(request, env.ACCESS_KEY);
    }

    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders,
    });
  },
};

async function getImages(
  request: Request,
  accessKey: string
): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return new Response("query is missing", {
      status: 400,
      headers: corsHeaders,
    });
  }

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}`,
    {
      headers: {
        Authorization: "Client-ID" + " " + accessKey,
      },
    }
  );
  const data = await res.json<UnsplashResponse>();
  const images = data.results.map((image) => ({
    id: image.id,
    image: image.urls.small,
    link: image.links.html,
  }));

  return new Response(JSON.stringify(images), {
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}
