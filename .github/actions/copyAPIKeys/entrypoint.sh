#!/bin/sh -l

JSON_FMT='{"google": {"client_id": "%s", "picker": "%s", "fonts": "%s"}}\n'

printf "$JSON_FMT" "$CLIENT_ID" "$PICKER" "$PICKER" > .api_keys.dev.json
