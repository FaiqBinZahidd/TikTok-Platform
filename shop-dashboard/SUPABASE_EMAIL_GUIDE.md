# Supabase Configuration Guide

## 1. Fix "Wrong Link" in Email
The email link usually points to `localhost:3000` by default. If your app is running on a different port (like 5173) or a public URL, you must change this.

1.  Go to **Supabase Dashboard**.
2.  Click **Authentication** (Key icon) -> **URL Configuration**.
3.  **Site URL**: Change this to your app's URL.
    *   Development: `http://localhost:5173`
    *   Production: `https://your-domain.com`
4.  **Redirect URLs**: Add `http://localhost:5173/**` to the whitelist.

## 2. Fix "Cheap" Email Look
Supabase uses a very basic default HTML template.

1.  Go to **Authentication** -> **Email Templates**.
2.  Click **"Invite User"**.
3.  You can edit the **Message Body** (HTML).
4.  **Suggestion**: Replace the default text with a professional HTML Button.

### Professional Email Template Code (Copy Paste this):
```html
<h2>Welcome to Quantro Dashboard</h2>
<p>You have been invited to join the Quantro Retail Intelligence Platform.</p>
<p>Click the button below to accept your invitation and set your password:</p>

<a href="{{ .ConfirmationURL }}" 
   style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
   Accept Invitation
</a>

<p style="font-size: 12px; color: #666; margin-top: 20px;">
  If you did not expect this invitation, you can safely ignore this email.
</p>
```
5. Click **Save**.
