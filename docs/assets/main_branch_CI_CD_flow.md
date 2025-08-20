sequenceDiagram
    participant Dev as Developer
    participant FB as Feature Branch  
    participant PR as Pull Request
    participant GHA as GitHub Actions
    participant Main as Main Branch
    participant CF as Cloudflare
    participant GHR as GitHub Releases
    
    Dev->>FB: Push changes
    Dev->>PR: Create PR
    PR->>GHA: Trigger "Lint & Test"
    
    Note over GHA: Run linting & testing
    
    GHA->>PR: Checks passed
    PR->>Main: Merge approved
    
    Note over Main: Analyze changed paths
    
    alt Mobile App Changes (apps/mobile/**)
        Main->>GHA: Trigger "Build SDK"
        Note over GHA: Build SDK tarball
        GHA->>GHA: Upload SDK artifact
        GHA-->>Dev: SDK ready for download
    end
    
    alt Web App Changes (apps/web/**)
        Main->>GHA: Trigger "Deploy Web"
        Note over GHA: Build web application
        GHA->>CF: Deploy to Cloudflare Workers
        CF-->>Dev: Website updated
    end
    
    alt Documentation Changes (docs/**)
        Main->>GHA: Trigger "Compile Docs"
        Note over GHA: Build docs with Docker
        GHA->>Main: Auto-commit built docs
        Main-->>Dev: Docs updated
    end
    
    Note over Dev: For SDK releases
    Dev->>Main: Create sdk-v* tag
    Main->>GHA: Trigger "Build SDK" (tag mode)
    Note over GHA: Build + Release mode
    GHA->>GHR: Create GitHub Release
    GHR-->>Dev: SDK v* released publicly
