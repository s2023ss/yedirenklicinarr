from supabase import create_client, Client
import sys
import postgrest

def create_test_table():
    url: str = "http://supabasesecond-supabase-121a0e-94-154-32-150.traefik.me"
    service_role_key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlzcyI6InN1cGFiYXNlIn0.jzfQt7YIzdDTx3ZDPQYNtxhiaK8CCNKC8IP7lYHzUfw"
    
    try:
        supabase: Client = create_client(url, service_role_key)
        
        # Note: In self-hosted or certain Supabase configurations, 
        # direct SQL execution via RPC might be needed if postgrest doesn't support it directly.
        # However, we can try to use the raw postgrest client if available or just test if we can 
        # do a basic admin operation.
        
        print("Attempting to create table 'test_table'...")
        
        # SQL to run
        sql = """
        CREATE TABLE IF NOT EXISTS test_table (
            id SERIAL PRIMARY KEY,
            name TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        """
        
        # In Supabase, the best way to run SQL from a client is often via an RPC 
        # or if the environment allows direct SQL (rare for PostgREST).
        # Since I can't be sure if 'exec_sql' RPC exists, I'll try to check if I can 
        # at least access the schema.
        
        # For this specific task, if direct DDL isn't working via the library, 
        # I will inform the user. But usually Service Role can do more.
        
        # Let's try to see if there's an RPC we can use or if we can just perform a table check.
        # Most self-hosted Supabase instances have 'exec_sql' or similar for management.
        
        try:
            # Using the exact parameter name 'sql_query' as defined in the SQL Editor
            response = supabase.rpc("exec_sql", {"sql_query": sql}).execute()
            print("Successfully executed SQL via RPC.")
            
            # Now verify by inserting a row
            print("Inserting test row into 'test_table'...")
            insert_response = supabase.table("test_table").insert({"name": "Test Entry"}).execute()
            print(f"Insert successful: {insert_response}")
            
            # Select the row back
            select_response = supabase.table("test_table").select("*").eq("name", "Test Entry").execute()
            print(f"Select verification: {select_response}")
            
        except Exception as e:
            print(f"RPC/Verification failed: {e}")
            
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    create_test_table()
