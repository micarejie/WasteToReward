# EcoReward landing page (Blazor)

Blazor conversion of the PHP `index.php` landing page.

## Where to put these files in your .NET solution

Copy into your Blazor web project (the project listed in `RVMMonitoringSystem.slnx`), for example:

```text
YourBlazorApp/
  Pages/
    Index.razor              ← landing page route "/"
  Components/
    LoginModal.razor
    RegisterModal.razor
    EcoTipsModal.razor
    Icon*.razor
  wwwroot/css/
    ecoreward-home.css
```

Do **not** put pages inside the `.slnx` file. That file only lists projects.

## Wire CSS + Tailwind in your layout

In `App.razor`, `Components/App.razor`, or `_Host.cshtml` `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<link href="css/ecoreward-home.css" rel="stylesheet" />
```

## Connect landing → login

This conversion keeps the PHP behavior: **Sign In / Register open Blazor modals**.

Successful login navigates to `/dashboard`:

```csharp
Navigation.NavigateTo("/dashboard");
```

If you prefer a separate login page instead of a modal, replace `OpenLogin()` with:

```csharp
Navigation.NavigateTo("/login");
```

and create `Pages/Login.razor` with `@page "/login"`.

## Auth TODO

`LoginModal.razor` and `RegisterModal.razor` have placeholder submit handlers. Replace the `TODO` sections with your real auth service (Identity, API, etc.) — the old PHP posted to `auth.php`.

## PHP → Blazor map

| PHP | Blazor |
| --- | --- |
| `index.php` | `Pages/Index.razor` (`@page "/"`) |
| `showLogin()` SweetAlert | `LoginModal.razor` |
| `showRegister()` SweetAlert | `RegisterModal.razor` |
| `showEcoTips()` | `EcoTipsModal.razor` |
| Lucide JS icons | `Icon*.razor` SVG components |
| `about.php` / `contactMe.php` | `/about`, `/contact` routes |
| `auth.php` POST | modal `OnValidSubmit` handlers |
