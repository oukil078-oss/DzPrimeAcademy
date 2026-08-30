import os
import httpx
from fastapi import FastAPI, Request, Response

NEXT_INTERNAL_URL = os.environ.get("NEXT_INTERNAL_URL", "http://127.0.0.1:3000")

app = FastAPI()
client = httpx.AsyncClient(base_url=NEXT_INTERNAL_URL, timeout=30.0)


@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
async def proxy(request: Request, path: str):
    url = f"/api/{path}"
    body = await request.body()
    headers = {k: v for k, v in request.headers.items() if k.lower() not in ("host", "content-length")}

    upstream_response = await client.request(
        request.method,
        url,
        params=request.query_params,
        content=body,
        headers=headers,
    )

    response_headers = {
        k: v for k, v in upstream_response.headers.items()
        if k.lower() not in ("content-encoding", "transfer-encoding", "content-length", "connection")
    }

    return Response(
        content=upstream_response.content,
        status_code=upstream_response.status_code,
        headers=response_headers,
        media_type=upstream_response.headers.get("content-type"),
    )
