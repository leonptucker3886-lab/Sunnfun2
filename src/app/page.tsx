import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Next.js Starter
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A clean template built with Next.js 16, TypeScript, and Tailwind CSS 4.
          </p>
          <Button size="lg">Get Started</Button>
        </section>

        {/* Components Showcase */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Example Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Button Variants</h3>
              <div className="space-y-2">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Input Field</h3>
              <Input placeholder="Enter your email" type="email" />
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Card Component</h3>
              <p className="text-gray-600">
                This is an example card component with some content.
              </p>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
