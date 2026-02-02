import os
from supabase import create_client, Client

url: str = "https://supabase.yedirenklicinar.digitalalem.com"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njk4ODgxNDQsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlzcyI6InN1cGFiYXNlIn0.jzfQt7YIzdDTx3ZDPQYNtxhiaK8CCNKC8IP7lYHzUfw"
supabase: Client = create_client(url, key)

tables = [
    "profiles", "grades", "courses", "units", "topics", "learning_outcomes",
    "quizzes", "questions", "options", "submissions"
]

print(f"{'Table':<20} | {'Exists':<8} | {'RLS Enabled':<12}")
print("-" * 45)

for table in tables:
    try:
        # Check if table exists and RLS status
        # We use a query to pg_tables
        query = f"SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = '{table}'"
        res = supabase.rpc("exec_sql", {"sql_query": query}).execute()
        
        if res.data and len(res.data) > 0:
            exists = "Yes"
            rls = "Yes" if res.data[0]['rowsecurity'] else "No"
        else:
            exists = "No"
            rls = "N/A"
            
        print(f"{table:<20} | {exists:<8} | {rls:<12}")
    except Exception as e:
        print(f"{table:<20} | Error    | {str(e)}")
