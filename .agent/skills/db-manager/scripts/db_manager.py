import sys
import json
from supabase import create_client, Client

# Configuration (from supabase-service skill)
URL = "http://supabasesecond-supabase-121a0e-94-154-32-150.traefik.me"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlzcyI6InN1cGFiYXNlIn0.jzfQt7YIzdDTx3ZDPQYNtxhiaK8CCNKC8IP7lYHzUfw"

def execute_sql(query):
    try:
        supabase: Client = create_client(URL, SERVICE_ROLE_KEY)
        
        # Prepare query: if it starts with SELECT, wrap it for JSON output
        processed_query = query.strip()
        is_select = processed_query.upper().startswith("SELECT")
        
        if is_select:
            processed_query = f"SELECT row_to_json(t) FROM ({processed_query.strip(';')}) t"

        try:
            response = supabase.rpc("exec_sql", {"sql_query": processed_query}).execute()
        except Exception as e:
            # If it failed because it didn't return a SETOF json (for DDL), 
            # we might need to ignore the error if it actually succeeded
            if "does not return tuples" in str(e):
                print("Command executed successfully (no results).")
                return True
            raise e
        
        # Unwrap row_to_json if necessary
        formatted_data = []
        if response.data:
            for item in response.data:
                if isinstance(item, dict) and "row_to_json" in item:
                    formatted_data.append(item["row_to_json"])
                else:
                    formatted_data.append(item)
        
        print(json.dumps(formatted_data, indent=2, ensure_ascii=False))
        return True
    except Exception as e:
        print(f"Error executing SQL: {str(e)}", file=sys.stderr)
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python db_manager.py \"YOUR_SQL_QUERY\"")
        sys.exit(1)
    
    sql_query = sys.argv[1]
    execute_sql(sql_query)
