#!/bin/bash

# Change the path to your folder 
path=src

# Find all files in the given path
files=$(find $path -type f -name "*.tsx")

# Loop through all files and open each one, with a delay of 5 seconds between each file
for file in $files; do
   code $file
   sleep 5
done
