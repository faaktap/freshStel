@echo off
echo --------------  We should be using 16.17.1 for fresh.
echo --------------  check below what is set please
nvm list
pause "--------------  Break out of version is not 16....."
start npm run serve 
