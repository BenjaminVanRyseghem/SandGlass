#!/bin/bash

result=`echo $@ | nc -U /tmp/sand-glass-sock | sed "s/^\([\"']\)\(.*\)\1\$/\2/g" | sed "s/u001b/033/g"`
echo -e $result