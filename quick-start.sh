#!/bin/bash

# Matrix India Admin Dashboard - Quick Start Script

echo "🚀 Matrix India Admin Dashboard - Quick Start"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found!"
    echo ""
    echo "📋 Creating .env.local template..."
    cat > .env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-min-32-characters-long
EOF
    echo "✅ Created .env.local"
    echo ""
    echo "📝 Please update .env.local with your Supabase credentials:"
    echo "   1. Go to https://supabase.com"
    echo "   2. Create or login to your project"
    echo "   3. Copy Project URL and anon key to .env.local"
    echo ""
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Update .env.local with your Supabase credentials"
echo "   2. Run: npm run dev"
echo "   3. Visit: http://localhost:3000/admin"
echo ""
echo "🔑 Demo Credentials:"
echo "   Username: admin"
echo "   Password: password123"
echo ""
echo "📚 Documentation:"
echo "   - Read ADMIN_SETUP.md for detailed setup"
echo "   - Read ADMIN_DASHBOARD_README.md for features"
echo ""
