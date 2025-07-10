# Mermaid Test File

This file is for testing Mermaid diagram rendering in VS Code.

## Simple Test Diagram

```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
```

## Component Test

```mermaid
graph LR
    Frontend[🌐 Frontend] --> Backend[⚙️ Backend]
    Backend --> Database[🗄️ Database]
    Backend --> API[📡 External API]
```

## Sequence Test

```mermaid
sequenceDiagram
    participant User
    participant App
    participant API
    
    User->>App: Request
    App->>API: Call
    API-->>App: Response
    App-->>User: Result
```

If these simple diagrams work, then the issue is with specific syntax in the complex diagrams.
