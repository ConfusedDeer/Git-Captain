start cmd.exe @cmd /c "net stop iphlpsvc"
ping -n 5 127.0.0.1>nul
start cmd.exe @cmd /c "forver stopall"
ping -n 5 127.0.0.1>nul
start cmd.exe @cmd /c "netsh interface portproxy add v4tov4 listenport=443 listenaddress=10.40.15.57 connectport=3000 connectaddress=10.40.15.57"
ping -n 5 127.0.0.1>nul
start cmd.exe @cmd /c "uglifyjs --compress --mangle --output .\public\js\branchUtils.js  -- .\public\js\branchUtils.js"
ping -n 5 127.0.0.1>nul
start cmd.exe @cmd /c "uglifyjs --compress --mangle --output .\public\js\tools.js  -- .\public\js\tools.js"
ping -n 5 127.0.0.1>nul
start cmd.exe @cmd /c "uglifyjs --compress --mangle --output .\public\js\viewUtils.js  -- .\public\js\viewUtils.js"
ping -n 5 127.0.0.1>nul
start cmd.exe @cmd /c "cleancss -o .\public\css\styles.css .\public\css\styles.css"
ping -n 5 127.0.0.1>nul
start cmd.exe @cmd /c "net start iphlpsvc"
ping -n 5 127.0.0.1>nul
CD C:\Git-Captain\controllers\
forever start server.js
popd
echo.
echo === Server launched successfully ===
echo Press any key to close this window...
pause > nul
