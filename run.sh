
set -e  

cd Backend

if [ ! -d "venv" ]; then
    python -m venv venv
fi

# Activate venv (Linux/Mac)
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
else
    # Windows Git Bash version
    source venv/Scripts/activate
fi

# Install dependencies if needed
if [ -f "requirements.txt" ]; then
    pip install --upgrade pip
    pip install -r requirements.txt
else
    echo "No requirements.txt found in Backend/"
fi

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start Django server in background
echo "Starting Django backend on http://127.0.0.1:8000"
python manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!

cd ..



cd frontend

# Install node dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing Node.js dependencies..."
    npm install
fi

# Start React app
echo "🚀 Starting React app on http://localhost:3000 ..."
npm start &

FRONTEND_PID=$!

cd ..

echo "Press [CTRL+C] to stop both servers."

wait $BACKEND_PID $FRONTEND_PID
