# Stop PostgreSQL and Adminer with Docker Compose
Write-Host "🛑 Stopping PostgreSQL and Adminer..." -ForegroundColor Yellow

# Stop the services
docker-compose down

Write-Host "✅ Services stopped successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 To start the services again, run: .\start-db.ps1" -ForegroundColor Cyan

