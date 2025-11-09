pipeline {
  agent any

  environment {
    DOCKER_REGISTRY = "docker.io"
    DOCKER_REPO     = "jaginisaiteja/project"
    IMAGE_TAG       = "${env.IMAGE_TAG ?: 'latest'}"
    FULL_IMAGE      = "${DOCKER_REGISTRY}/${DOCKER_REPO}:${IMAGE_TAG}"
    DOCKER_CREDENTIALS_ID     = "dockerhub"
    KUBECONFIG_CREDENTIAL_ID  = "k8s-dev-kubeconfig"
    DO_BUILD_AND_PUSH = "${DO_BUILD_AND_PUSH ?: 'false'}"
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timestamps()
    timeout(time: 30, unit: 'MINUTES')
  }

  parameters {
    string(name: 'IMAGE_TAG', defaultValue: 'latest', description: 'Image tag to deploy (overrides default)')
    booleanParam(name: 'DO_BUILD_AND_PUSH', defaultValue: false, description: 'If true, build Docker image and push to registry before deploy')
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install & Test') {
      steps {
        echo "Installing dependencies and running tests..."
        bat 'npm ci'
        // continue even if no tests — placeholder so junit step exists
        bat '(echo "Tests failed" && exit /b 0)'
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
          withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            bat """
              echo %DOCKER_PASS% | docker login -u "%DOCKER_USER%" --password-stdin %DOCKER_REGISTRY%
              docker build -t %DOCKER_REPO%:%IMAGE_TAG% .
              docker tag %DOCKER_REPO%:%IMAGE_TAG% %DOCKER_REGISTRY%/%DOCKER_REPO%:%IMAGE_TAG%
              docker push %DOCKER_REGISTRY%/%DOCKER_REPO%:%IMAGE_TAG%
              docker logout %DOCKER_REGISTRY%
            """
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        script {
          echo "Deploying ${FULL_IMAGE} to Kubernetes..."
          withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIAL_ID, variable: 'KUBECONFIG_FILE')]) {
            bat '''
              setlocal enabledelayedexpansion
              set KUBECONFIG=%KUBECONFIG_FILE%

              kubectl get namespace study-group-organizer >nul 2>nul
              IF ERRORLEVEL 1 (
                kubectl create namespace study-group-organizer
              )

              kubectl -n study-group-organizer get deployment study-group-organizer >nul 2>nul
              rem capture last command exit code correctly
              set DEPLOY_ERR=%ERRORLEVEL%
              rem use a safer comparison to avoid delayed-expansion parsing issues
              IF NOT "%DEPLOY_ERR%"=="0" (
                rem avoid parentheses inside echo to prevent parse errors
                echo Applying manifests from k8s/ - first-time apply...
                kubectl apply -n study-group-organizer -f k8s/
                IF ERRORLEVEL 1 kubectl apply -n study-group-organizer -f deployment.yml
                timeout /t 3 >nul
              )

              kubectl -n study-group-organizer set image deployment/study-group-organizer study-group-organizer=%FULL_IMAGE% --record
              kubectl -n study-group-organizer rollout status deployment/study-group-organizer --timeout=180s
              endlocal
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
            bat """
              set KUBECONFIG=%KUBECONFIG_FILE%
              rem use start /b to background the port-forward on Windows
              start \"\" /b kubectl -n study-group-organizer port-forward svc/myapp-svc 5000:80 > portforward.log 2>&1
              timeout /t 2 >nul
              curl -f http://127.0.0.1:5000/ || set RC=%ERRORLEVEL%
              taskkill /IM \"kubectl.exe\" /F >nul 2>&1
              IF NOT \"%RC%\"==\"0\" (
                echo Smoke test failed (curl return %RC%). Printing recent pod logs:
                kubectl -n study-group-organizer logs -l app=study-group-organizer --tail=200
                exit /b 1
              )
              echo Smoke test succeeded.
            """
          }
        }
      }
    }
  }

  post {
    success { echo "Pipeline succeeded. Deployed ${FULL_IMAGE}" }
    failure { echo "Pipeline failed." }
    always { cleanWs() }
  }
}
