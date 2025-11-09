#!/bin/bash
# Bash deployment script for Kubernetes
# Usage: ./deploy.sh

set -e

NAMESPACE="study-group-organizer"
IMAGE="jaginisaiteja/project:latest"
SKIP_BUILD=false
DRY_RUN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --namespace)
            NAMESPACE="$2"
            shift 2
            ;;
        --image)
            IMAGE="$2"
            shift 2
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--namespace NAMESPACE] [--image IMAGE] [--skip-build] [--dry-run]"
            exit 1
            ;;
    esac
done

echo "=== Study Group Organizer Kubernetes Deployment ==="

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl is not installed or not in PATH"
    exit 1
fi

# Build Docker image (skip if using Docker Hub image by default)
if [ "$SKIP_BUILD" = false ]; then
    if [[ "$IMAGE" == jaginisaiteja/* ]]; then
        echo ""
        echo "[1/5] Using Docker Hub image - skipping local build"
        echo "Image will be pulled from Docker Hub: $IMAGE"
        SKIP_BUILD=true
    elif ! command -v docker &> /dev/null; then
        echo "Warning: Docker is not installed. Skipping build step."
        SKIP_BUILD=true
    else
        echo ""
        echo "[1/5] Building Docker image locally..."
        docker build -t "$IMAGE" .
        echo "Docker image built successfully"
    fi
else
    echo ""
    echo "[1/5] Skipping Docker build"
fi

# Update image in deployment.yaml if different from default
if [ "$IMAGE" != "jaginisaiteja/project:latest" ]; then
    echo ""
    echo "[2/5] Updating image reference in deployment.yaml..."
    sed -i.bak "s|image: jaginisaiteja/project:latest|image: $IMAGE|g" k8s/deployment.yaml
    rm -f k8s/deployment.yaml.bak
    echo "Image reference updated"
else
    echo ""
    echo "[2/5] Using Docker Hub image: $IMAGE"
fi

# Check Kubernetes cluster connection
echo ""
echo "[3/5] Checking Kubernetes cluster connection..."
if ! kubectl cluster-info &> /dev/null; then
    echo "Error: Cannot connect to Kubernetes cluster"
    echo "Please ensure kubectl is configured correctly"
    exit 1
fi
echo "Connected to Kubernetes cluster"

# Apply Kubernetes manifests (exclude kustomization.yaml as it's not a Kubernetes resource)
if [ "$DRY_RUN" = true ]; then
    echo ""
    echo "[4/5] Dry run - Validating manifests..."
    for file in namespace.yaml configmap.yaml deployment.yaml service.yaml ingress.yaml hpa.yaml; do
        kubectl apply -f "k8s/$file" --dry-run=client 2>/dev/null
    done
    echo "Dry run completed"
else
    echo ""
    echo "[4/5] Applying Kubernetes manifests..."
    ERROR_OCCURRED=false
    for file in namespace.yaml configmap.yaml deployment.yaml service.yaml ingress.yaml hpa.yaml; do
        if ! kubectl apply -f "k8s/$file"; then
            echo "Warning: Failed to apply $file"
            ERROR_OCCURRED=true
        fi
    done
    if [ "$ERROR_OCCURRED" = true ]; then
        echo "Some manifests failed to apply. Please check the errors above."
    else
        echo "All manifests applied successfully"
    fi
fi

# Wait for deployment to be ready
if [ "$DRY_RUN" = false ]; then
    echo ""
    echo "[5/5] Waiting for deployment to be ready..."
    if kubectl wait --for=condition=available --timeout=300s deployment/study-group-organizer -n "$NAMESPACE" 2>/dev/null; then
        echo "Deployment is ready!"
    else
        echo "Warning: Deployment may not be ready yet"
    fi
fi

# Show deployment status
if [ "$DRY_RUN" = false ]; then
    echo ""
    echo "=== Deployment Status ==="
    echo ""
    echo "Pods:"
    kubectl get pods -n "$NAMESPACE"
    
    echo ""
    echo "Services:"
    kubectl get services -n "$NAMESPACE"
    
    echo ""
    echo "Ingress:"
    kubectl get ingress -n "$NAMESPACE"
    
    echo ""
    echo "=== Access Information ==="
    echo "To access the application locally, run:"
    echo "kubectl port-forward -n $NAMESPACE service/study-group-organizer-service 5000:80"
    echo ""
    echo "Then open http://localhost:5000 in your browser"
fi

echo ""
echo "=== Deployment Complete ==="

