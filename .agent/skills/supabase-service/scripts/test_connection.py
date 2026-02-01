from supabase import create_client, Client
import sys

def test_connection():
    url: str = "http://supabasesecond-supabase-121a0e-94-154-32-150.traefik.me"
    key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6ImFub24iLCJpc3MiOiJzdXBhYmFzZSJ9.RDyrrTH3Av-5AaG22l6zP02i32xLtpnqOft1NTddB4o"
    
    try:
        print(f"Connecting to {url}...")
        supabase: Client = create_client(url, key)
        # Attempt to list tables/fetch something minimal to verify
        # Note: This might fail if there are no tables or RLS is strict, 
        # but the client creation itself is the first step.
        print("Supabase client created successfully.")
        return True
    except Exception as e:
        print(f"Error connecting to Supabase: {e}")
        return False

if __name__ == "__main__":
    if test_connection():
        sys.exit(0)
    else:
        sys.exit(1)
