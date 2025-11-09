# Where is the Application Deployed?

## 🎯 Deployment Location

Your application is deployed on a **local Kubernetes cluster (Kind)** running on your machine.

### Cluster Information:
- **Cluster Type**: Kind (Kubernetes in Docker)
- **Cluster Name**: kind-control-plane
- **Cluster IP**: 172.19.0.2
- **Control Plane**: https://127.0.0.1:61054
- **Namespace**: `study-group-organizer`

### Deployment Details:
- **Pods**: 3 pods running
- **Service**: ClusterIP (internal only)
- **Service IP**: 10.96.42.158
- **Port**: 80 (maps to container port 5000)
- **Image**: jaginisaiteja/project:latest

## 🌐 How to Access the Application

Since the service is **ClusterIP** (internal only), you have these options:

### Option 1: Port Forward (Recommended for Local Access)

```powershell
kubectl port-forward -n study-group-organizer service/study-group-organizer-service 5000:80
```

Then open in your browser: **http://localhost:5000**

**Keep the terminal window open** while accessing the application.

### Option 2: Change Service to NodePort (For External Access)

If you want to access it without port-forward, change the service type:

1. Edit `k8s/service.yaml`:
```yaml
spec:
  type: NodePort  # Change from ClusterIP to NodePort
```

2. Apply the change:
```powershell
kubectl apply -f k8s/service.yaml
```

3. Get the NodePort:
```powershell
kubectl get service -n study-group-organizer
```

4. Access via: `http://localhost:<NODE_PORT>`

### Option 3: Use Ingress (Requires Ingress Controller)

If you want to use the ingress, you need to install an ingress controller first:

**For Kind cluster:**
```powershell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```

Wait for it to be ready:
```powershell
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=300s
```

Then update your hosts file:
```
127.0.0.1 study-group-organizer.local
```

Access via: **http://study-group-organizer.local**

## 📍 Current Deployment Status

```
✅ Namespace: study-group-organizer
✅ Deployment: study-group-organizer (3/3 pods ready)
✅ Service: study-group-organizer-service (ClusterIP)
✅ Ingress: study-group-organizer-ingress (no controller installed)
✅ Image: jaginisaiteja/project:latest
```

## 🚀 Quick Access Commands

### Check Deployment Status:
```powershell
kubectl get all -n study-group-organizer
```

### Access Application (Port Forward):
```powershell
kubectl port-forward -n study-group-organizer service/study-group-organizer-service 5000:80
```

### View Logs:
```powershell
kubectl logs -f -n study-group-organizer -l app=study-group-organizer
```

### Get Pod IPs (for internal cluster access):
```powershell
kubectl get pods -n study-group-organizer -o wide
```

## 🔧 Change Service Type for External Access

If you want to access the application from outside the cluster without port-forward:

### Option A: Change to NodePort
Edit `k8s/service.yaml` and change:
```yaml
type: ClusterIP  # Change this
```
to:
```yaml
type: NodePort  # Change to this
```

Then apply:
```powershell
kubectl apply -f k8s/service.yaml
kubectl get service -n study-group-organizer
```

### Option B: Change to LoadBalancer (for cloud providers)
```yaml
type: LoadBalancer
```

**Note**: LoadBalancer only works on cloud providers (GKE, EKS, AKS) or with a LoadBalancer service like MetalLB.

## 📊 Summary

**Current Status**: 
- ✅ Deployed locally in Kind cluster
- ✅ Running and healthy (3 pods)
- ⚠️ Only accessible via port-forward (ClusterIP)
- ⚠️ Ingress configured but no controller installed

**To Access**:
1. Use port-forward (easiest): `kubectl port-forward -n study-group-organizer service/study-group-organizer-service 5000:80`
2. Or change service to NodePort for direct access
3. Or install ingress controller for domain-based access

## 🎯 Next Steps

1. **For immediate access**: Use port-forward command above
2. **For permanent external access**: Change service type to NodePort
3. **For domain-based access**: Install ingress controller and configure DNS

