# PowerShell script to apply Kubernetes manifests (excluding kustomization.yaml)
# Usage: .\apply-manifests.ps1

$manifestFiles = @(
    "namespace.yaml",
    "configmap.yaml",
    "deployment.yaml",
    "service.yaml",
    "ingress.yaml",
    "hpa.yaml"
)

Write-Host "Applying Kubernetes manifests..." -ForegroundColor Cyan

foreach ($file in $manifestFiles) {
    if (Test-Path "k8s\$file") {
        Write-Host "Applying $file..." -ForegroundColor Yellow
        kubectl apply -f "k8s\$file"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "$file applied successfully" -ForegroundColor Green
        } else {
            Write-Host "Error applying $file" -ForegroundColor Red
        }
    } else {
        Write-Host "Warning: $file not found" -ForegroundColor Yellow
    }
}

Write-Host "`nDeployment complete!" -ForegroundColor Green
Write-Host "Check status with: kubectl get all -n study-group-organizer" -ForegroundColor Cyan

