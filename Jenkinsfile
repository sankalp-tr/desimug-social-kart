pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
        dir('server') {
          sh 'npm ci'
        }
      }
    }

    stage('Build') {
      steps {
        sh 'npx tsc --noEmit'
        sh 'npm run build'
      }
    }

    stage('Test') {
      steps {
        // Placeholder until Roadmap Phase 8 adds real Jest/RTL (frontend)
        // and Supertest (backend) suites — this stage runs them then.
        echo 'No automated tests yet (Roadmap Phase 8) — skipping.'
      }
    }

    stage('Deploy') {
      when { branch 'main' }
      environment {
        RENDER_DEPLOY_HOOK = credentials('render-deploy-hook')
        VERCEL_DEPLOY_HOOK = credentials('vercel-deploy-hook')
      }
      steps {
        sh 'curl -fsS -X POST "$RENDER_DEPLOY_HOOK"'
        sh 'curl -fsS -X POST "$VERCEL_DEPLOY_HOOK"'
      }
    }
  }
}
