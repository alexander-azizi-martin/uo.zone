#!/usr/bin/env python3
import pathlib
import dotenv
import browser_cookie3

env_file = pathlib.Path(__file__).parent.joinpath('../.env').resolve()
env_values = dotenv.dotenv_values(env_file)

cookies = browser_cookie3.firefox()
for cookie in cookies:
    if cookie.name == "SSESS6483c99e0d6fc7b7554c57814d17fc09":
        env_values["UOZONE_COOKIE"] = cookie.value
    elif cookie.name == "CookieName":
        env_values["BLUERA_COOKIE"] = cookie.value

with env_file.open('w') as f:
    for key in env_values:
        f.write(f'{key}="{env_values[key]}"\n')
