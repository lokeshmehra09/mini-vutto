# Start PostgreSQL and Adminer with Docker Compose
Write-Host "🚀 Starting PostgreSQL and Adminer..." -ForegroundColor Green

# Start the services
docker-compose up -d

Write-Host "✅ Services started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 PostgreSQL Connection Details:" -ForegroundColor Cyan
Write-Host "   Host: localhost" -ForegroundColor White
Write-Host "   Port: 5432" -ForegroundColor White
Write-Host "   Database: mini_vutto" -ForegroundColor White
Write-Host "   Username: mini_vutto" -ForegroundColor White
Write-Host "   Password: minivutto123" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Adminer is available at:" -ForegroundColor Cyan
Write-Host "   http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "💡 To stop the services, run: docker-compose down" -ForegroundColor Yellow
