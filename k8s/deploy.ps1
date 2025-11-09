# PowerShell deployment script for Kubernetes
# Usage: .\deploy.ps1

param(
    [string]$Namespace = "study-group-organizer",
    [string]$Image = "jaginisaiteja/project:latest",
    [switch]$SkipBuild = $false,
    [switch]$DryRun = $false
)

Write-Host "=== Study Group Organizer Kubernetes Deployment ===" -ForegroundColor Green

# Check if kubectl is installed
if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
    Write-Host "Error: kubectl is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if Docker is installed (for building)
if (-not $SkipBuild) {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Host "Warning: Docker is not installed. Skipping build step." -ForegroundColor Yellow
        $SkipBuild = $true
    }
}

# Build Docker image (skip if using Docker Hub image by default)
if (-not $SkipBuild) {
    if ($Image -like "jaginisaiteja/*") {
        Write-Host "`n[1/5] Using Docker Hub image - skipping local build" -ForegroundColor Cyan
        Write-Host "Image will be pulled from Docker Hub: $Image" -ForegroundColor Green
        $SkipBuild = $true
    } else {
        Write-Host "`n[1/5] Building Docker image locally..." -ForegroundColor Cyan
        docker build -t $Image .
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Error: Docker build failed" -ForegroundColor Red
            exit 1
        }
        Write-Host "Docker image built successfully" -ForegroundColor Green
    }
} else {
    Write-Host "`n[1/5] Skipping Docker build" -ForegroundColor Yellow
}

# Update image in deployment.yaml if different from default
if ($Image -ne "jaginisaiteja/project:latest") {
    Write-Host "`n[2/5] Updating image reference in deployment.yaml..." -ForegroundColor Cyan
    $deploymentContent = Get-Content "k8s\deployment.yaml" -Raw
    $deploymentContent = $deploymentContent -replace "image: jaginisaiteja/project:latest", "image: $Image"
    Set-Content -Path "k8s\deployment.yaml" -Value $deploymentContent -NoNewline
    Write-Host "Image reference updated" -ForegroundColor Green
} else {
    Write-Host "`n[2/5] Using Docker Hub image: $Image" -ForegroundColor Cyan
}

# Check Kubernetes cluster connection
Write-Host "`n[3/5] Checking Kubernetes cluster connection..." -ForegroundColor Cyan
kubectl cluster-info | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Cannot connect to Kubernetes cluster" -ForegroundColor Red
    Write-Host "Please ensure kubectl is configured correctly" -ForegroundColor Yellow
    exit 1
}
Write-Host "Connected to Kubernetes cluster" -ForegroundColor Green

# Apply Kubernetes manifests (exclude kustomization.yaml as it's not a Kubernetes resource)
if ($DryRun) {
    Write-Host "`n[4/5] Dry run - Validating manifests..." -ForegroundColor Cyan
    $manifestFiles = @("namespace.yaml", "configmap.yaml", "deployment.yaml", "service.yaml", "ingress.yaml", "hpa.yaml")
    foreach ($file in $manifestFiles) {
        kubectl apply -f "k8s\$file" --dry-run=client 2>&1 | Out-Null
    }
    Write-Host "Dry run completed" -ForegroundColor Green
} else {
    Write-Host "`n[4/5] Applying Kubernetes manifests..." -ForegroundColor Cyan
    $manifestFiles = @("namespace.yaml", "configmap.yaml", "deployment.yaml", "service.yaml", "ingress.yaml", "hpa.yaml")
    $errorOccurred = $false
    foreach ($file in $manifestFiles) {
        kubectl apply -f "k8s\$file"
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Warning: Failed to apply $file" -ForegroundColor Yellow
            $errorOccurred = $true
        }
    }
    if ($errorOccurred) {
        Write-Host "Some manifests failed to apply. Please check the errors above." -ForegroundColor Yellow
    } else {
        Write-Host "All manifests applied successfully" -ForegroundColor Green
    }
}

# Wait for deployment to be ready
if (-not $DryRun) {
    Write-Host "`n[5/5] Waiting for deployment to be ready..." -ForegroundColor Cyan
    kubectl wait --for=condition=available --timeout=300s deployment/study-group-organizer -n $Namespace
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Deployment is ready!" -ForegroundColor Green
    } else {
        Write-Host "Warning: Deployment may not be ready yet" -ForegroundColor Yellow
    }
}

# Show deployment status
if (-not $DryRun) {
    Write-Host "`n=== Deployment Status ===" -ForegroundColor Green
    Write-Host "`nPods:" -ForegroundColor Cyan
    kubectl get pods -n $Namespace
    
    Write-Host "`nServices:" -ForegroundColor Cyan
    kubectl get services -n $Namespace
    
    Write-Host "`nIngress:" -ForegroundColor Cyan
    kubectl get ingress -n $Namespace
    
    Write-Host "`n=== Access Information ===" -ForegroundColor Green
    Write-Host "To access the application locally, run:" -ForegroundColor Yellow
    Write-Host "kubectl port-forward -n $Namespace service/study-group-organizer-service 5000:80" -ForegroundColor White
    Write-Host "`nThen open http://localhost:5000 in your browser" -ForegroundColor White
}

Write-Host "`n=== Deployment Complete ===" -ForegroundColor Green

