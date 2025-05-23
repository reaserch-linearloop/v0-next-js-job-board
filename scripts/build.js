const { execSync } = require("child_process")

// Log the start of the build process
console.log("🚀 Starting build process...")

try {
  // Force Prisma to generate the client
  console.log("📦 Generating Prisma Client...")
  execSync("npx prisma generate", { stdio: "inherit" })

  // Run the Next.js build
  console.log("🏗️ Building Next.js application...")
  execSync("next build", { stdio: "inherit" })

  console.log("✅ Build completed successfully!")
} catch (error) {
  console.error("❌ Build failed:", error)
  process.exit(1)
}
