# EcoReward Blazor landing

Converted from `index.php` and wired into your existing auth `Index.razor`.

## What to copy into `RVMMonitoringSystem.Client`

| This folder | Put it here |
| --- | --- |
| `Pages/Index.razor` | **Replace** your current `Pages/Index.razor` |
| `Components/EcoRewardLanding.razor` | `Components/EcoRewardLanding.razor` |
| `Components/EcoRewardLanding.razor.css` | Same folder as the `.razor` file (required) |

`Layout/EmptyLayout.razor` is optional. `Index.razor` uses your existing `Layout.LoginLayout`.

## Required for a successful build / publish

1. Copy **both** `EcoRewardLanding.razor` **and** `EcoRewardLanding.razor.css`.
2. Do **not** leave two pages with `@page "/"` (only one `Index.razor`).
3. Keep your existing `LoadingSpinner` and `Layout.LoginLayout`.
4. Publish the **host/server** project if this is a Blazor WebAssembly hosted app — not only `.Client` (unless you intentionally publish a standalone WASM client).

## How it connects

1. `@page "/"` still runs your auth check first.
2. **Authenticated** users redirect to `/user-dashboard`, `/admin-dashboard`, or `/login`.
3. **Guests** stay on `/` and see `EcoRewardLanding`.
4. Sign In / Join Now / My Dashboard go to `/login`.

## Common publish / build errors

| Error | Fix |
| --- | --- |
| `EcoRewardLanding` could not be found | Copy the component into `Components/` and rebuild |
| `EmptyLayout` could not be found | You don't need it — use the updated `Index.razor` that uses `LoginLayout` |
| Ambiguous routes / duplicate `@page "/"` | Remove the old Index or the extra page with `@page "/"` |
| Publish Client but site 404 / blank | Publish the Server/Host project, or set the correct `<base href="..." />` |

## If it still fails

Paste the **exact** Error List / Output window text (or a screenshot of the publish dialog error) so it can be fixed precisely.
