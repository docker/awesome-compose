## NapCat with qq-ai-bot

This sample shows a **messaging-native AI bot stack** using
[NapCat](https://github.com/NapNeko/NapCatQQ) as the **OneBot 11** transport and
[qq-ai-bot](https://github.com/happysnaker/qq-ai-bot) as the **ACP bridge**.

The stack is intentionally aimed at **local validation and tinkering**, not production deployment:

- **NapCat** handles QQ login plus OneBot message transport.
- **qq-ai-bot** exposes a reverse WebSocket endpoint, keeps per-chat sessions, and forwards prompts and progress through ACP.
- The sample uses the **built-in mock ACP agent** that ships inside the `qq-ai-bot` image so you can validate the whole path before wiring your own agent runtime.

Project structure:

```text
.
├── compose.yaml
├── napcat.onebot11.reverse-ws.json
└── README.md
```

[_compose.yaml_](compose.yaml)

```yaml
services:
  qq-ai-bot:
    image: ghcr.io/happysnaker/qq-ai-bot:latest
    ports:
      - "18080:8080"
    ...
  napcat:
    image: mlikiowa/napcat-docker:latest
    ports:
      - "3000:3000"
      - "6099:6099"
    ...
```

When you start the sample, Docker Compose creates two services:

- `qq-ai-bot` for the OneBot 11 ↔ ACP bridge
- `napcat` for QQ login and transport

The sample maps:

- `http://localhost:6099/webui` → NapCat WebUI
- `http://localhost:18080/readyz` → `qq-ai-bot` readiness endpoint
- `http://localhost:18080/status` → `qq-ai-bot` status endpoint

> ℹ️ **Info**
> By default this sample leaves the OneBot token empty on both sides to keep the first run simple.
> If you want a token, set the same value in both `ONEBOT_ACCESS_TOKEN` inside `compose.yaml`
> and the `token` field inside `napcat.onebot11.reverse-ws.json`.

## Deploy with Docker Compose

```shell
docker compose up -d
```

## Expected result

Check that both containers are running:

```shell
docker compose ps
```

You should see two running containers similar to:

```text
NAME                         IMAGE                                 STATUS
napcat-qq-ai-bot-napcat-1    mlikiowa/napcat-docker:latest        Up
napcat-qq-ai-bot-qq-ai-bot-1 ghcr.io/happysnaker/qq-ai-bot:latest Up (healthy)
```

## Validate the stack

1. Open NapCat WebUI at `http://localhost:6099/webui`
2. Sign in with the default WebUI token `napcat` (or your `WEBUI_TOKEN` override)
3. Scan the QQ login QR code in NapCat
4. Send `/ping` or `/status` to the bot in QQ
5. Optionally confirm the bridge health endpoints:

   ```shell
   curl http://localhost:18080/readyz
   curl http://localhost:18080/status
   ```

Once the chain is healthy, you have validated a full local path:

```text
QQ -> NapCat / OneBot 11 -> qq-ai-bot -> mock ACP agent
```

## Customize the agent side

This sample intentionally starts with the built-in mock ACP agent to keep the first run deterministic.

To swap in your own ACP-compatible agent, edit these environment variables in `compose.yaml`:

- `ACP_AGENT_COMMAND`
- `ACP_AGENT_ARGS_JSON`
- `ACP_AGENT_WORKDIR`

You can also tune other bridge settings, such as group mention requirements, progress mode, session storage, and text-length limits, directly in the `qq-ai-bot` service definition.

## Cleanup

Stop the sample:

```shell
docker compose down
```

Remove the persistent QQ login state and bot data as well:

```shell
docker compose down -v
```
