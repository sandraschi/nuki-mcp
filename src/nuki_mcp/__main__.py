"""Enable ``python -m nuki_mcp``.

The fleet launcher runs ``python -m nuki_mcp``. Without this file Python refuses with
"'nuki_mcp' is a package and cannot be directly executed", and because the backend
starts in a hidden window that failure was silent -- the dashboard loaded and every
API call returned 404.

nuki_mcp.main has no ``main`` function (the [project.scripts] entry pointing at one
was wrong and its console script never worked either); the module builds a FastMCP
instance and runs it under ``if __name__ == "__main__"``. This does the same thing.
"""

from __future__ import annotations

import sys

from nuki_mcp.main import mcp


def _run() -> int:
    mcp.run()
    return 0


if __name__ == "__main__":
    sys.exit(_run())
