@echo off
echo [1/2] Building your initial Docker image...
docker compose build --no-cache

echo.
echo [2/2] Starting the container...
docker compose up -d

echo.
echo Setup complete! You can now manage this app inside Docker Desktop.
pause
