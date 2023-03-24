#!/bin/bash

# change the path to your folder
path=src

find $path -type f -name "*" -print0 | xargs -0 code
