# Quick Deployment Guide

## ✅ Your Deployment is Already Running!

**Status**: All 3 pods are running successfully!
- **Image**: `jaginisaiteja/project:latest` ✅
- **Pods**: 3/3 Running ✅
- **Namespace**: `study-group-organizer` ✅

## Deployment Methods

### Method 1: Use the Deployment Script (Recommended)
```powershell
cd k8s
.\deploy.ps1
```

### Method 2: Apply Manifests Individually
```powershell
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
```

### Method 3: Use the Apply Script
```powershell
cd k8s
.\apply-manifests.ps1
```

### Method 4: Use Kustomize (if installed)
```powershell
kubectl apply -k k8s/
```

## ⚠️ Important Note

**Don't use**: `kubectl apply -f k8s/`

This will try to apply `kustomization.yaml` which is not a Kubernetes resource and will cause an error. Use one of the methods above instead.

## Check Deployment Status

```powershell
# Check all resources
kubectl get all -n study-group-organizer

# Check pods
kubectl get pods -n study-group-organizer

# Check deployment
kubectl get deployment -n study-group-organizer

# View logs
kubectl logs -f -n study-group-organizer -l app=study-group-organizer
```

## Access the Application

### Port Forward (for testing):
```powershell
kubectl port-forward -n study-group-organizer service/study-group-organizer-service 5000:80
```

Then open: http://localhost:5000

## Troubleshooting

### If pods are not starting:
```powershell
# Check pod status
kubectl get pods -n study-group-organizer

# Describe pod for details
kubectl describe pod <pod-name> -n study-group-organizer

# Check logs
kubectl logs <pod-name> -n study-group-organizer
```

### If image pull fails:
- Verify image exists: `docker pull jaginisaiteja/project:latest`
- Check image pull policy in deployment.yaml (should be `Always`)
- Verify Kubernetes cluster has internet access

### If deployment fails:
```powershell
# Check deployment events
kubectl describe deployment study-group-organizer -n study-group-organizer

# Check replica set
kubectl get rs -n study-group-organizer

# Check events
kubectl get events -n study-group-organizer --sort-by='.lastTimestamp'
```

## Current Deployment Info

- **Namespace**: study-group-organizer
- **Image**: jaginisaiteja/project:latest
- **Replicas**: 3
- **Service**: ClusterIP on port 80
- **Container Port**: 5000
- **Health Checks**: Configured (liveness, readiness, startup)

## Next Steps

1. ✅ Deployment is running
2. Access via port-forward or ingress
3. Monitor with `kubectl get pods -n study-group-organizer`
4. Scale if needed: `kubectl scale deployment study-group-organizer --replicas=5 -n study-group-organizer`

