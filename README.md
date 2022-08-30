# map-dl

A formula-based web scraper, made to download and convert
public transit and cycling maps—mostly in the Greater Toronto and Hamilton Area.

Note: Depending on the requests being made, it may be necessary to run node with
the flag `--insecure-http-parser`. See [#27711@nodejs/node](https://github.com/nodejs/node/issues/27711#issuecomment-584621376).
In this repository, the `cycling-mississauga` formula is the one and only culprit.
