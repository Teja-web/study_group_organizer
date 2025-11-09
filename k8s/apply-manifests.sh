#!/bin/bash
# Bash script to apply Kubernetes manifests (excluding kustomization.yaml)
# Usage: ./apply-manifests.sh

set -e

manifest_files=(
    "namespace.yaml"
    "configmap.yaml"
    "deployment.yaml"
    "service.yaml"
    "ingress.yaml"
    "hpa.yaml"
)

echo "Applying Kubernetes manifests..."

for file in "${manifest_files[@]}"; do
    if [ -f "k8s/$file" ]; then
        echo "Applying $file..."
        kubectl apply -f "k8s/$file"
        echo "$file applied successfully"
    else
        echo "Warning: $file not found"
    fi
done

echo ""
echo "Deployment complete!"
echo "Check status with: kubectl get all -n study-group-organizer"

