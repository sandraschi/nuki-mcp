# nuki-mcp (MCPB Bundle)

Nuki Smart Lock MCP Server via Home Assistant Bridge

## Usage

Add to \claude_desktop_config.json\:
\\\json
{
  "mcpServers": {
    "nuki-mcp": {
      "command": "uv",
      "args": ["run", "--directory", "\D:\Dev\repos", "python", "-m", "nuki_mcp"],
      "env": { "PYTHONPATH": "\D:\Dev\repos/src" }
    }
  }
}
\\\

## Tools

- **get_lock_status**: get_lock_status
- **set_lock_state**: set_lock_state
- **buzz_opener**: buzz_opener
- **smart_entry_sequence**: smart_entry_sequence

## Requirements

- Python 3.12+
- uv
