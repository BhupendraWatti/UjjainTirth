# Headless CMS Architecture

## Data Flow
```
App loads -> React Native calls your WordPress API -> WordPress sends JSON -> Store in state -> UI renders from state
```

## Architecture View

```
WordPress Admin Panel
        ↓
WordPress Database
        ↓
WordPress REST API
        ↓
React Native App (fetches JSON)
        ↓
Mobile UI updates
```
