'use client'

export default function Footer() {
  return (
    <footer className="footer py-6 px-6 text-center">
      <p>&copy; {new Date().getFullYear()} Patrick Daglas, 20963798, {new Date().toLocaleDateString()}</p>
    </footer>
  )
}