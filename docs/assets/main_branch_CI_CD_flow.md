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
        Main->>GHA: Trigger "Build APK"
        Note over GHA: Build APK
        GHA->>GHA: Upload APK artifact
        GHA-->>Dev: APK ready for download
    end

    alt Website Changes (apps/web/**)
        Main->>GHA: Trigger "Deploy Web"
        Note over GHA: Build website
        GHA->>CF: Deploy to Cloudflare Workers
        CF-->>Dev: Website updated
    end

    alt Documentation Changes (docs/**)
        Main->>GHA: Trigger "Compile Docs"
        Note over GHA: Build docs with Docker
        GHA->>Main: Auto-commit built docs
        Main-->>Dev: Docs updated
    end

    Note over Dev: For APK releases
    Dev->>Main: Create apk-v* tag
    Main->>GHA: Trigger "Build APK" (tag mode)
    Note over GHA: Build + Release mode
    GHA->>GHR: Create GitHub Release
    GHR-->>Dev: APK v* released publicly

