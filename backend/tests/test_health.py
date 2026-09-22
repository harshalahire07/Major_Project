from httpx import AsyncClient


async def test_health_returns_ok(client: AsyncClient) -> None:
    response = await client.get("/api/health")
    assert response.status_code == 200

    body = response.json()
    assert body["status"] == "healthy"
    assert "version" in body


async def test_health_contains_environment(client: AsyncClient) -> None:
    response = await client.get("/api/health")
    body = response.json()
    assert "environment" in body
