@echo off
echo [1/2] Stopping the old container and cleaning up...
docker compose down

echo.
echo [2/2] Rebuilding and launching with your latest code...
docker compose up --build -d

echo.
echo Update complete! Your app is now running the latest code.
pause
