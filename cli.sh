#!/bin/bash

echo $@ | nc -U /tmp/sand-glass-sock | sed "s/^\([\"']\)\(.*\)\1\$/\2/g"
