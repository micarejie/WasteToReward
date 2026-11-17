# EcoReward Index.razor

Single Blazor landing page converted from `index.php`.

## Use it

1. Copy `Pages/Index.razor` into your Blazor project.
2. Keep (or create) your own `Login.razor` with:

```razor
@page "/login"
```

3. Sign In / Register / Join Now / My Dashboard already call:

```csharp
Navigation.NavigateTo("/login");
```

That is the only connection needed between the landing page and login.
