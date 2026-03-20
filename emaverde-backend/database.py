import psycopg2

def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="emaverde_multimedia2",
        user="postgres",
        password="WJ28@krhps"
    )