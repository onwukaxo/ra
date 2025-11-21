import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Menu from './Menu'
import Community from './Community'
import heroBg from '../assets/background2-optimized-CjkZWacr.jpg'

const whyRations = [
  { title: 'Quality Ingredients', description: 'We use only the freshest, locally-sourced ingredients.' },
  { title: 'Incredibly Fast', description: 'Your delicious meal is ready in minutes, never compromising on taste.' },
  { title: 'Community Focused', description: 'We are proud to be a part of and serve the Abuja community.' },
  { title: 'Convenient', description: 'Easy to order, easy to enjoy. Perfect for your busy lifestyle.' }
]

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section  */}
      <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-6">
        {/* Background image */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
          aria-hidden
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 -z-10 bg-black/50" />

        {/* Content container  */}
        <div className="relative mx-auto max-w-6xl px-6 py-28 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Food, culture & community in every bite.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Experience the best meals, made with love and fresh ingredients just for you.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/menu" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-ration-yellow text-brand-primary font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-light transition duration-300">
                Order Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Rations Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Why Rations?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyRations.map((reason) => (
            <div key={reason.title} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-brand-dark">{reason.title}</h3>
              <p className="mt-2 text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular / Featured Menu using Menu embed */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Our Popular Dishes</h2>
        <div className="max-w-5xl mx-auto">
          <Menu embed />
        </div>
        <div className="text-center mt-8">
          <Link to="/menu" className="text-brand-primary font-semibold hover:underline">
            See Full Menu &rarr;
          </Link>
        </div>
      </section>

      {/* Community CTA + Community embed */}
      <section className="space-y-10">
        <div className="text-center bg-ration-dark rounded-lg p-8 shadow-md">
          <h2 className="text-3xl text-white font-bold mb-4">Join Our Community</h2>
          <p className="text-lg text-gray-300 mb-6">
            See what’s happening, from events to special announcements.
          </p>
          <Link
            to="/community"
            className="inline-block bg-ration-yellow text-ration-dark font-bold py-3 px-8 rounded-lg hover:bg-ration-yellow-hover transition duration-300"
          >
            Community Updates
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-center md:text-left">From the community</h2>
          <Community embed />
        </div>
      </section>
    </div>
  )
}
