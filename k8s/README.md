# Kubernetes Deployment - Quick Start

## Quick Deployment

### Option 1: Using PowerShell Script (Windows)
```powershell
cd k8s
.\deploy.ps1
```

### Option 2: Using Bash Script (Linux/Mac)
```bash
cd k8s
chmod +x deploy.sh
./deploy.sh
```

### Option 3: Manual Deployment (Recommended)
```bash
# Apply manifests individually (excludes kustomization.yaml)
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml

# Or use the apply script
cd k8s
.\apply-manifests.ps1  # Windows
./apply-manifests.sh   # Linux/Mac

# Or use kustomize (if you have kustomize installed)
kubectl apply -k k8s/
```

**Note**: Don't use `kubectl apply -f k8s/` directly as it will try to apply `kustomization.yaml` which causes an error. Use the individual files or the apply scripts instead.

## Prerequisites

1. **Kubernetes cluster** (Minikube, Kind, or cloud provider)
2. **kubectl** installed and configured
3. **Docker image** already pushed to Docker Hub: `jaginisaiteja/project:latest`

## Docker Image

The deployment is configured to use the Docker Hub image:
- **Image**: `jaginisaiteja/project:latest`
- **Registry**: Docker Hub
- **Image Pull Policy**: Always (will pull latest from Docker Hub)

If you need to use a different image, update `deployment.yaml`:
```yaml
image: your-registry/your-image:tag
```

## Access the Application

### Port Forward (for testing):
```bash
kubectl port-forward -n study-group-organizer service/study-group-organizer-service 5000:80
```
Then open: http://localhost:5000

### Check Status:
```bash
kubectl get all -n study-group-organizer
```

## Files Overview

- `namespace.yaml` - Creates the namespace
- `deployment.yaml` - Deploys the application pods
- `service.yaml` - Exposes the application
- `ingress.yaml` - External access (optional)
- `configmap.yaml` - Configuration
- `hpa.yaml` - Auto-scaling (optional)
- `kustomization.yaml` - Kustomize configuration

## For Detailed Instructions

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guide.

