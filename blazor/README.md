# EcoReward Blazor landing

Converted from `index.php` and wired into your existing auth `Index.razor`.

## What to copy into `RVMMonitoringSystem.Client`

| This folder | Put it here |
| --- | --- |
| `Pages/Index.razor` | Replace your current `Pages/Index.razor` (or merge) |
| `Components/EcoRewardLanding.razor` | `Components/EcoRewardLanding.razor` |
| `Components/EcoRewardLanding.razor.css` | Next to the component (scoped CSS) |
| `Layout/EmptyLayout.razor` | `Layout/EmptyLayout.razor` |

## How it connects

1. `@page "/"` still runs your auth check first.
2. **Authenticated** users are redirected the same way as before (`/user-dashboard`, `/admin-dashboard`, or `/login`).
3. **Guests** stay on `/` and see `EcoRewardLanding` (the old PHP home page).
4. Sign In / Register / Join Now / My Dashboard navigate to `/login` or `/register` instead of PHP `auth.php` + SweetAlert.

## Routes used by the landing

Ensure these routes exist (or change the `href`s in `EcoRewardLanding.razor`):

- `/login`
- `/register`
- `/about`
- `/rewards`
- `/contact`
- `/learn-more`

If you do not have a register page yet, point `GoRegister` at `/login`.

## Optional CSS font

Add Inter in `index.html` / `App.razor` head if you want the same font as the PHP page:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```
