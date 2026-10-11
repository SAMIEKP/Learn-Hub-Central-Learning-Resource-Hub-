# Supabase Auth Configuration Guide

## Email Confirmation Setup

By default, Supabase Auth requires email confirmation before users can sign in. This is the secure and recommended approach.

### How It Works:

1. User registers → Account created (but unconfirmed)
2. Supabase sends confirmation email
3. User clicks email link → Email confirmed
4. User can now sign in with their credentials

### Configure Email Confirmation in Supabase Dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Click on **Email** provider
4. Ensure **Confirm email** is **enabled** (this is the default)
5. Configure **Email Templates**:
   - **Confirm signup** - The email sent after registration
   - **Reset password** - The email sent for password reset
   - **Email change** - The email sent when user changes email

### Customize Email Templates:

1. In **Authentication** > **Email Templates**
2. Click on **Confirm signup**
3. Customize the email subject and body
4. Use variables like `{{ .ConfirmationURL }}` for the confirmation link
5. Save your changes

### Important Settings:

**Redirect URLs:**
1. Go to **Authentication** > **URL Configuration**
2. Add your app URLs:
   - **Site URL**: `http://localhost:3000` (dev) or your production URL
   - **Redirect URLs**: Add `http://localhost:3000/**` and your production URLs
3. This ensures the confirmation link redirects back to your app

### Disable Email Confirmation (Not Recommended):

If you want to allow users to sign in without email confirmation (not recommended for production):

1. Go to **Authentication** > **Providers**
2. Click on **Email** provider
3. Disable **Confirm email**
4. Users can sign in immediately after registration

⚠️ **Warning**: Disabling email confirmation is less secure and not recommended for production apps.

### Test Email Confirmation:

1. Start your app
2. Try to register a new account
3. Check your email (or Supabase dashboard logs if email not configured)
4. Click the confirmation link
5. You should be redirected to your app
6. Try to sign in with the new account

### Troubleshooting:

**Issue: Not receiving confirmation emails**
- Check Supabase dashboard logs (Authentication > Users)
- Ensure email provider is configured in Supabase
- Check spam folder
- Try with a different email address

**Issue: Confirmation link doesn't redirect**
- Check Redirect URLs in Supabase dashboard
- Ensure your app URL is added to the allowed list
- Check browser console for errors

**Issue: User can sign in without confirming email**
- Ensure "Confirm email" is enabled in Email provider settings
- Check if user was created before this setting was enabled

### Current Implementation:

Your app is configured to:
- ✅ Send confirmation email on registration
- ✅ Show "Check your email" message
- ✅ Prevent access until email is confirmed
- ✅ Redirect to complete profile after confirmation

Users will see:
1. Registration form
2. "Check your email" message after registration
3. After clicking email link, they'll be automatically signed in
4. Then redirected to complete their profile

### Next Steps:

1. Configure email templates in Supabase Dashboard
2. Add your app URLs to Redirect URLs
3. Test the full registration flow
4. Customize email branding if desired
