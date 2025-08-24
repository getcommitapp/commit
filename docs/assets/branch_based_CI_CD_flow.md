gitGraph
commit id: "Initial"

    branch feature-mobile
    checkout feature-mobile
    commit id: "Mobile changes"
    commit id: "More mobile work"

    branch feature-web
    checkout feature-web
    commit id: "Web changes"
    commit id: "Web fixes"

    branch feature-docs
    checkout feature-docs
    commit id: "Docs update"

    checkout main
    merge feature-mobile
    commit id: "Mobile merged"

    merge feature-web
    commit id: "Web merged"

    merge feature-docs
    commit id: "Docs merged"

    commit id: "Release: mobile-v0.3.0" tag: "mobile-v0.3.0"
