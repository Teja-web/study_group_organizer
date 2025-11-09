# Kubernetes Deployment Guide

This guide will help you deploy the Study Group Organizer application to Kubernetes.

## Prerequisites

1. **Kubernetes Cluster** - Minikube, Kind, or a cloud provider (GKE, EKS, AKS)
2. **kubectl** - Kubernetes command-line tool
3. **Docker Image** - Your application image in a container registry (Docker Hub, GCR, ECR, ACR, etc.)
4. **Ingress Controller** (optional) - For external access (NGINX, Traefik, etc.)

## Step 1: Docker Image (Already Configured ✅)

**Your Docker image is already configured and pushed to Docker Hub:**
- **Image**: `jaginisaiteja/project:latest`
- **Registry**: Docker Hub
- **Status**: Ready to deploy

The Kubernetes manifests are already configured to use this image. No changes needed!

### If you need to update the image in the future:

Edit `k8s/deployment.yaml`:
```yaml
image: jaginisaiteja/project:latest
imagePullPolicy: Always
```

Or update `k8s/kustomization.yaml`:
```yaml
images:
  - name: jaginisaiteja/project
    newName: jaginisaiteja/project
    newTag: latest
```

## Step 2: Configure Kubernetes

### Option A: Using kubectl directly

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create configmap
kubectl apply -f k8s/configmap.yaml

# Create deployment
kubectl apply -f k8s/deployment.yaml

# Create service
kubectl apply -f k8s/service.yaml

# Create ingress (optional)
kubectl apply -f k8s/ingress.yaml

# Create HPA (optional)
kubectl apply -f k8s/hpa.yaml
```

### Option B: Using Kustomize

```bash
# Apply all resources
kubectl apply -k k8s/
```

### Option C: Apply all at once

```bash
kubectl apply -f k8s/
```

## Step 3: Verify Deployment

```bash
# Check namespace
kubectl get namespace study-group-organizer

# Check pods
kubectl get pods -n study-group-organizer

# Check deployment
kubectl get deployment -n study-group-organizer

# Check service
kubectl get service -n study-group-organizer

# Check ingress
kubectl get ingress -n study-group-organizer

# View pod logs
kubectl logs -f -n study-group-organizer -l app=study-group-organizer

# Describe pod (for troubleshooting)
kubectl describe pod -n study-group-organizer -l app=study-group-organizer
```

## Step 4: Access the Application

### Using Port Forward (for testing):
```bash
kubectl port-forward -n study-group-organizer service/study-group-organizer-service 5000:80
```
Access at: http://localhost:5000

### Using NodePort (if service type is NodePort):
```bash
kubectl get service -n study-group-organizer
# Use the NodePort shown in the output
```

### Using Ingress:
Update `k8s/ingress.yaml` with your domain and ensure you have an ingress controller installed.

For local testing with Minikube:
```bash
minikube addons enable ingress
minikube tunnel
```

Then access via the host specified in ingress.yaml.

## Configuration Options

### Update Replicas:
Edit `k8s/deployment.yaml`:
```yaml
spec:
  replicas: 5  # Change number of replicas
```

### Update Resource Limits:
Edit `k8s/deployment.yaml`:
```yaml
resources:
  requests:
    memory: "128Mi"
    cpu: "200m"
  limits:
    memory: "256Mi"
    cpu: "500m"
```

### Update Service Type:
Edit `k8s/service.yaml`:
```yaml
spec:
  type: LoadBalancer  # or NodePort, ClusterIP
```

### Configure Ingress:
Edit `k8s/ingress.yaml`:
- Update `host` with your domain
- Uncomment TLS section for HTTPS
- Adjust annotations based on your ingress controller

## Scaling

### Manual Scaling:
```bash
kubectl scale deployment study-group-organizer -n study-group-organizer --replicas=5
```

### Automatic Scaling (HPA):
HPA is already configured. It will automatically scale between 2-10 replicas based on CPU and memory usage.

## Troubleshooting

### Check pod status:
```bash
kubectl get pods -n study-group-organizer
kubectl describe pod <pod-name> -n study-group-organizer
```

### Check logs:
```bash
kubectl logs <pod-name> -n study-group-organizer
kubectl logs -f -n study-group-organizer -l app=study-group-organizer
```

### Check events:
```bash
kubectl get events -n study-group-organizer --sort-by='.lastTimestamp'
```

### Debug pod:
```bash
kubectl exec -it <pod-name> -n study-group-organizer -- sh
```

### Delete and redeploy:
```bash
kubectl delete -f k8s/
kubectl apply -f k8s/
```

## Clean Up

```bash
# Delete all resources
kubectl delete -f k8s/

# Or using kustomize
kubectl delete -k k8s/

# Delete namespace (deletes everything in namespace)
kubectl delete namespace study-group-organizer
```

## Production Recommendations

1. **Use a container registry** - Don't use `imagePullPolicy: IfNotPresent` with local images
2. **Configure resource limits** - Set appropriate requests and limits
3. **Enable HPA** - For automatic scaling
4. **Set up monitoring** - Use Prometheus and Grafana
5. **Configure logging** - Set up centralized logging
6. **Use secrets** - Store sensitive data in Kubernetes Secrets
7. **Enable TLS** - Configure HTTPS with cert-manager
8. **Set up backups** - Backup your data regularly
9. **Use network policies** - Restrict network traffic
10. **Enable pod security policies** - For better security

## Cloud-Specific Instructions

### Google Kubernetes Engine (GKE):
```bash
gcloud container clusters get-credentials your-cluster-name --zone your-zone
kubectl apply -f k8s/
```

### Amazon EKS:
```bash
aws eks update-kubeconfig --name your-cluster-name
kubectl apply -f k8s/
```

### Azure Kubernetes Service (AKS):
```bash
az aks get-credentials --resource-group your-resource-group --name your-cluster-name
kubectl apply -f k8s/
```

## Environment Variables

If you need to set environment variables, you can:
1. Update `k8s/configmap.yaml` for non-sensitive data
2. Create a Secret for sensitive data:
```bash
kubectl create secret generic study-group-organizer-secrets \
  --from-literal=firebase-api-key=your-key \
  -n study-group-organizer
```

Then reference it in `deployment.yaml`:
```yaml
env:
- name: FIREBASE_API_KEY
  valueFrom:
    secretKeyRef:
      name: study-group-organizer-secrets
      key: firebase-api-key
```

