pipeline {
  agent any

  // === Configure these in the job or change defaults here ===
  environment {
    // Image info (default: use image already on Docker Hub)
    DOCKER_REGISTRY = "docker.io"                      // Docker Hub
    DOCKER_REPO     = "jaginisaiteja/project"          // your repo/image path on Docker Hub
    IMAGE_TAG       = "${env.IMAGE_TAG ?: 'latest'}"   // default 'latest', can be overridden by job param
    FULL_IMAGE      = "${DOCKER_REGISTRY}/${DOCKER_REPO}:${IMAGE_TAG}"

    // Jenkins credential IDs (create these in Jenkins Credentials)
    DOCKER_CREDENTIALS_ID = "docker-creds"     // optional: set this if you want to push images
    KUBECONFIG_CREDENTIAL_ID = "kubeconfig-cred"

    // Toggle: if true, Jenkins will build & push image; else it will skip build/push and deploy existing image
    DO_BUILD_AND_PUSH = "${DO_BUILD_AND_PUSH ?: 'false'}" // set to 'true' to build/push
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timestamps()
    ansiColor('xterm')
    timeout(time: 30, unit: 'MINUTES')
  }

  parameters {
    string(name: 'IMAGE_TAG', defaultValue: 'latest', description: 'Image tag to deploy (overrides default)')
    booleanParam(name: 'DO_BUILD_AND_PUSH', defaultValue: false, description: 'If true, build Docker image and push to registry before deploy')
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Test') {
      steps {
        echo "Installing dependencies and running tests..."
        sh 'npm ci'
        // if you have tests, run them. If none, this can be replaced with build step.
        sh 'npm test || (echo "Tests failed"; exit 1)'
        archiveArtifacts artifacts: 'package-lock.json', fingerprint: true
        junit testResults: '**/test-results/*.xml', allowEmptyResults: true
      }
    }

    stage('Build (optional)') {
      when {
        expression { return params.DO_BUILD_AND_PUSH.toString() == 'true' || env.DO_BUILD_AND_PUSH == 'true' }
      }
      steps {
        script {
          echo "Building Docker image ${FULL_IMAGE}"
          // Option A: use docker CLI (agent must have docker)
          withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh '''
              echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin ${DOCKER_REGISTRY}
              docker build -t ${DOCKER_REPO}:${IMAGE_TAG} .
              docker tag ${DOCKER_REPO}:${IMAGE_TAG} ${DOCKER_REGISTRY}/${DOCKER_REPO}:${IMAGE_TAG}
              docker push ${DOCKER_REGISTRY}/${DOCKER_REPO}:${IMAGE_TAG}
              docker logout ${DOCKER_REGISTRY}
            '''
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        script {
          echo "Deploying ${FULL_IMAGE} to Kubernetes..."
          // Uses kubeconfig file stored as Jenkins secret file credential
          withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIAL_ID, variable: 'KUBECONFIG_FILE')]) {
            sh '''
              export KUBECONFIG=${KUBECONFIG_FILE}

              # Ensure kubectl can access the namespace; create it if it doesn't exist
              kubectl get namespace study-group-organizer || kubectl create namespace study-group-organizer

              # Verify deployment exists; create if absent from k8s manifests
              # If you have k8s manifests in repo under k8s/, apply them once (they include service)
              if ! kubectl -n study-group-organizer get deployment study-group-organizer >/dev/null 2>&1; then
                echo "Applying manifests from k8s/ (first-time apply)..."
                kubectl apply -n study-group-organizer -f k8s/ || kubectl apply -n study-group-organizer -f deployment.yml
                sleep 3
              fi

              # Update image with kubectl set image for rolling update
              kubectl -n study-group-organizer set image deployment/study-group-organizer study-group-organizer=${FULL_IMAGE} --record

              # Wait for rollout to finish
              kubectl -n study-group-organizer rollout status deployment/study-group-organizer --timeout=180s
            '''
          }
        }
      }
    }

    stage('Smoke Tests') {
      steps {
        script {
          echo "Running smoke test against service..."
          withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIAL_ID, variable: 'KUBECONFIG_FILE')]) {
            sh '''
              export KUBECONFIG=${KUBECONFIG_FILE}

              # find service external IP or port-forward to test
              # try to curl serviceClusterIP via port-forward for a short-lived test
              kubectl -n study-group-organizer port-forward svc/myapp-svc 5000:80 >/tmp/portforward.log 2>&1 & 
              PF_PID=$!
              sleep 2

              # try health endpoint
              set +e
              curl -f http://127.0.0.1:5000/ || RC=$?
              set -e

              kill $PF_PID || true
              wait $PF_PID 2>/dev/null || true

              if [ "${RC:-0}" != "0" ]; then
                echo "Smoke test failed (curl return $RC). Printing recent pod logs:"
                kubectl -n study-group-organizer logs -l app=study-group-organizer --tail=200
                exit 1
              fi
              echo "Smoke test succeeded."
            '''
          }
        }
      }
    }
  }

  post {
    success {
      echo "Pipeline succeeded. Deployed ${FULL_IMAGE}"
      // add notifications here (Slack, email)
    }
    failure {
      echo "Pipeline failed."
      // optionally rollback here using kubectl rollout undo
    }
    always {
      cleanWs()
    }
  }
}
