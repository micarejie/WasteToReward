# EcoReward home (landing first, login second)

Guests open `/` and see **EcoReward** immediately. Login only appears when they click Sign In / Register / Join Now / My Dashboard.

## Copy into `RVMMonitoringSystem.Client`

| File | Action |
| --- | --- |
| `Pages/EcoReward.razor` | Add (this is the new `@page "/"`) |
| `Layout/EmptyLayout.razor` | Add if you do not already have it |

Then fix routing conflicts:

1. **Remove `@page "/"` from your old `Pages/Index.razor`** (or delete that file). Only one page may own `/`.
2. Keep `Login.razor` as `@page "/login"` only — not `@page "/"`.
3. Rebuild / republish the host project.

## Why login was showing first

The earlier `Index.razor` used `@layout Layout.LoginLayout`, waited on an auth spinner, and only then rendered the landing. This version:

- Uses `EmptyLayout` (no login chrome)
- Renders the EcoReward landing on first paint
- Marks the page `[AllowAnonymous]`
- Silently redirects **already signed-in** users to `/user-dashboard` or `/admin-dashboard`
- Sends guests to `/login` only from buttons

## If AuthorizeRouteView still forces login

In `Routes.razor` / `App.razor`, unauthenticated users must be allowed on `/`. `EcoReward.razor` already has:

```razor
@attribute [Microsoft.AspNetCore.Authorization.AllowAnonymous]
```

If every route still redirects to login, your `AuthorizeRouteView` `NotAuthorized` content is catching `/` — keep this page anonymous, or move login redirect so it does not apply to `/`.
