from supabase import create_client, Client
import json

URL = "http://supabasesecond-supabase-121a0e-94-154-32-150.traefik.me"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlzcyI6InN1cGFiYXNlIn0.jzfQt7YIzdDTx3ZDPQYNtxhiaK8CCNKC8IP7lYHzUfw"

def setup_db():
    supabase: Client = create_client(URL, SERVICE_ROLE_KEY)
    
    # Define/Fix exec_sql
    fix_sql = """
    CREATE OR REPLACE FUNCTION public.exec_sql(sql_query text)
    RETURNS SETOF json AS $$
    BEGIN
      RETURN QUERY EXECUTE sql_query;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    """
    
    try:
        # Note: If exec_sql is already broken or returns void, 
        # we might not be able to use it to redefine it if the existing one 
        # is incompatible with the RPC call format.
        # But usually, you can redefine it.
        print("Redefining exec_sql...")
        supabase.rpc("exec_sql", {"sql_query": fix_sql}).execute()
        print("Successfully redefined exec_sql.")
    except Exception as e:
        print(f"Failed to redefine exec_sql via RPC: {e}")
        print("Attempting to use direct SQL if available (unlikely for this client)...")

if __name__ == "__main__":
    setup_db()
