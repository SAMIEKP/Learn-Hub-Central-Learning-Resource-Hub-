"""Read published resources from Supabase's server-side Data API."""

from __future__ import annotations

import json
import os
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


RESOURCE_COLUMNS = (
    "id,title,description,subject,department,form,topic,examination_year,"
    "resource_type,author,source,file_path,file_name,file_size_bytes,mime_type,"
    "verification_status,version,extracted_text,keywords,created_at,updated_at"
)


class SupabaseResourceStore:
    """Fetch verified resources with a server-only Supabase key."""

    def __init__(self, url: str | None = None, key: str | None = None, page_size: int = 1000):
        self.url = (url or os.environ.get("SUPABASE_URL", "")).rstrip("/")
        self.key = key or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
        self.page_size = page_size

    def list_resources(self) -> list[dict[str, Any]]:
        if not self.url or not self.key:
            raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")

        resources: list[dict[str, Any]] = []
        offset = 0
        while True:
            params = urlencode({
                "select": RESOURCE_COLUMNS,
                "verification_status": "eq.verified",
                "order": "created_at.desc",
                "limit": self.page_size,
                "offset": offset,
            })
            request = Request(
                f"{self.url}/rest/v1/resources?{params}",
                headers={
                    "apikey": self.key,
                    "Authorization": f"Bearer {self.key}",
                    "Accept": "application/json",
                },
            )
            try:
                with urlopen(request, timeout=10) as response:
                    batch = json.loads(response.read().decode("utf-8"))
            except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as error:
                raise RuntimeError("Unable to load resources from Supabase") from error

            if not isinstance(batch, list):
                raise RuntimeError("Supabase returned an invalid resources response")
            resources.extend(item for item in batch if isinstance(item, dict))
            if len(batch) < self.page_size:
                return resources
            offset += self.page_size
